import React, { useMemo, useState } from 'react';
import { Button, Input, message, Radio } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { IExamDetail, IOptionsLocal, IQuestionRequest, TExamInfo } from '../../../../types/exam.types';
import { examService } from '../../../../services';
import GeneralLoading from '../../../../components/base/GeneralLoading';
import Visibility from '../../../../components/base/visibility';

interface IProps {
  courseId: string;
  examProps?: IExamDetail;
}

const STARTED_QUESTION_DEFAULT = 1;

export default function ExamDetailSection({ courseId, examProps }: IProps) {
  const navigate = useNavigate();
  const [examInfo, setExamInfo] = useState<TExamInfo>({
    name: examProps?.name ?? '',
    level: examProps?.level ?? 'EASY',
    timeExam: examProps?.timeExam ?? 30,
    description: examProps?.description ?? '',
  });
  const [listQuestions, setListQuestions] = useState<IQuestionRequest[]>(
    examProps?.questions.map(
      (q): IQuestionRequest => ({
        ...q,
        options: q.options.map((option, index) => ({
          id: index,
          content: option.content,
        })),
      }),
    ) ?? [],
  );
  const [currentOrder, setCurrentOrder] = useState<number>(
    STARTED_QUESTION_DEFAULT,
  );
  const [loading, setLoading] = useState<boolean>(false);

  const currentQuestion = useMemo((): IQuestionRequest | null => {
    if (!listQuestions.length) return null;
    return (
      listQuestions?.find((question) => question.order === currentOrder) ?? null
    );
  }, [listQuestions, currentOrder]);

  const handleAddNewQuestion = () => {
    const newQuestion: IQuestionRequest = {
      order: listQuestions.length + 1,
      content: '',
      options: [],
      correctAnswer: '',
    };
    setListQuestions([...listQuestions, newQuestion]);
    setCurrentOrder(newQuestion.order);
  };

  const maxOrderQuestion = useMemo(() => {
    return Math.max(...listQuestions.map((q) => q.order));
  }, [listQuestions]);

  const handleUpdateNumberQuestion = (
    question: IQuestionRequest,
    index: number,
  ): IQuestionRequest => {
    return {
      ...question,
      order: index + 1,
    };
  };

  const nextMultiAnswer: IOptionsLocal = React.useMemo(() => {
    return {
      id: currentQuestion?.options?.length
        ? currentQuestion?.options?.length + 1
        : 1,
      content: '',
    };
  }, [currentQuestion?.options?.length]);

  const handleAddNewOptionAnswer = () => {
    if (!currentQuestion) return;
    const newQuestion: IQuestionRequest = {
      ...currentQuestion!,
      options: currentQuestion?.options?.length
        ? [...currentQuestion.options, nextMultiAnswer]
        : [nextMultiAnswer],
    };
    const updatedListQuestions = listQuestions?.map((question) => {
      return question.order === currentOrder ? newQuestion : question;
    });
    setListQuestions(updatedListQuestions);
  };

  const handleUpdateOptionAnswer = (
    id: number,
    value: string,
    isCorrectAnswer = false,
  ) => {
    const updatedQuestion: IQuestionRequest = {
      ...currentQuestion!,
      correctAnswer: isCorrectAnswer
        ? value
        : currentQuestion?.correctAnswer ?? '',
      options:
        currentQuestion?.options.map((option) =>
          option.id === id ? { ...option, content: value } : option,
        ) ?? [],
    };
    const updatedListQuestions = listQuestions?.map((question) => {
      return question.order === currentOrder ? updatedQuestion : question;
    });
    setListQuestions(updatedListQuestions);
  };
  const handleUpdateCorrectAnswer = (value: string) => {
    const updatedQuestion: IQuestionRequest = {
      ...currentQuestion!,
      correctAnswer: value,
    };
    const updatedListQuestions = listQuestions?.map((question) => {
      return question.order === currentOrder ? updatedQuestion : question;
    });
    setListQuestions(updatedListQuestions);
  };

  const handleDeleteOptionAnswer = (id: number) => {
    const updatedQuestion: IQuestionRequest = {
      ...currentQuestion!,
      options:
        currentQuestion?.options
          .filter((option) => option.id !== id)
          .map((op, index) => ({
            id: index + 1,
            content: op.content,
          })) ?? [],
    };
    const updatedListQuestions = listQuestions?.map((question) => {
      return question.order === currentOrder ? updatedQuestion : question;
    });
    setListQuestions(updatedListQuestions);
  };

  const handleSubmit = async () => {
    if(!courseId) {
      message.error('Please select a course to create an exam');
      return;
    }
    if (!(examInfo.name && examInfo.level && examInfo.timeExam)) {
      message.error(
        'Please enter exam information before submitting (including name, level, time limit)',
      );
      return;
    }
    if (!listQuestions.length) {
      message.error('Please add at least one question before submitting');
      return;
    }
    try {
      setLoading(true);
      const data = {
        name: examInfo.name,
        level: examInfo.level,
        timeExam: examInfo.timeExam,
        description: examInfo.description,
        questions: listQuestions.map((question) => ({
          order: question.order,
          content: question.content,
          options: question.options.map((option) => ({content: option.content})),
          correctAnswer: question.correctAnswer,
        })),
      };
      const rs = examProps?._id
        ? await examService.updateExam(examProps?._id, data)
        : await examService.createExam({...data, courseId});
      message.success(rs.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-5">
      <div className="grid grid-cols-5 gap-x-8 gap-y-3">
        <div className="col-span-3 flex flex-col justify-start items-start space-y-1">
          <span className="text-lg font-semibold">Name of exam</span>
          <Input
            size="large"
            value={examInfo?.name}
            onChange={(e) => {
              setExamInfo((pre) => ({ ...pre, name: e.target.value }));
            }}
          />
        </div>
        <div className="flex flex-col justify-start items-start space-y-1">
          <span className="text-lg font-semibold">Time limit (minutes)</span>
          <Input
            size="large"
            type="number"
            value={examInfo?.timeExam}
            onChange={(e) => {
              setExamInfo((pre) => ({
                ...pre,
                timeFinish: Number(e.target.value),
              }));
            }}
          />
        </div>
        <div className="col-span-3 flex flex-col justify-start items-start space-y-1">
          <span className="text-lg font-semibold">Description</span>
          <TextArea
            size="large"
            value={examInfo.description}
            onChange={(e) => {
              setExamInfo((pre) => ({
                ...pre,
                description: e.target.value,
              }));
            }}
          />
        </div>
        <div className="col-span-2 flex flex-col justify-start items-start space-y-1">
          <span className="text-lg font-semibold">Level exam</span>
          <Radio.Group
            value={examInfo.level}
            onChange={(e) => {
              setExamInfo((pre) => ({
                ...pre,
                level: e.target.value,
              }));
            }}
          >
            <Radio value={'EASY'}>EASY</Radio>
            <Radio value={'MEDIUM'}>MEDIUM</Radio>
            <Radio value={'HARD'}>HARD</Radio>
          </Radio.Group>
        </div>
      </div>
      {currentQuestion && (
        <div className="shadow-md rounded-2xl py-4 px-8 flex flex-col justify-start items-start bg-gray-200 space-y-3">
          <div className="w-full flex justify-between items-center">
            <span className="text-xl font-semibold">
              Question {currentQuestion.order}
            </span>
            <Button
              className="ms-3"
              variant="solid"
              color="danger"
              shape="default"
              onClick={() => {
                const updatedListQuestions = listQuestions
                  .filter(
                    (question) => question.order !== currentQuestion.order,
                  )
                  .map(handleUpdateNumberQuestion);
                setCurrentOrder(
                  updatedListQuestions.length > 0
                    ? updatedListQuestions[0].order
                    : STARTED_QUESTION_DEFAULT,
                );
                setListQuestions(updatedListQuestions);
              }}
              icon={<DeleteOutlined />}
            />
          </div>
          <div className="flex flex-col justify-start items-start space-y-1 w-full">
            <span className="text-lg font-semibold">Content of exam</span>
            <Input
              size="large"
              value={currentQuestion.content}
              onChange={(e) => {
                setListQuestions((pre) => {
                  const updatedQuestion = pre.map((item) => {
                    if (item.order === currentQuestion.order) {
                      return { ...item, content: e.target.value };
                    }
                    return item;
                  });
                  return updatedQuestion;
                });
              }}
            />
          </div>
          <div className="flex flex-col justify-start items-start space-y-2 w-full">
            <span className="text-lg font-semibold">Option answer</span>
            <Visibility visibility={currentQuestion.options.length > 0}>
              {currentQuestion.options.map((option) => (
                <div
                  key={option.id}
                  className="grid grid-cols-12 gap-x-3 w-[60%] items-center justify-items-start"
                >
                  <Input
                    size="large"
                    className={`col-span-8 ${
                      option.content === currentQuestion.correctAnswer &&
                      'border-green-600 border-[2px]'
                    }`}
                    value={option.content}
                    onChange={(e) => {
                      handleUpdateOptionAnswer(
                        option.id,
                        e.target.value,
                        option.content === currentQuestion.correctAnswer,
                      );
                    }}
                  />
                  <Button
                    variant="solid"
                    className="col-span-1"
                    color="danger"
                    shape="default"
                    onClick={() => {
                      handleDeleteOptionAnswer(option.id);
                    }}
                    icon={<DeleteOutlined />}
                  />
                  <div className="col-span-3 flex flex-row justify-between items-center space-x-2">
                    <Radio
                      value={option.content}
                      checked={option.content === currentQuestion.correctAnswer}
                      onChange={(e) => {
                        handleUpdateCorrectAnswer(e.target.value);
                      }}
                    />
                    <Visibility
                      visibility={
                        option.content === currentQuestion.correctAnswer
                      }
                    >
                      <span className="text-base font-semibold text-green-600">
                        Correct answer
                      </span>
                    </Visibility>
                  </div>
                </div>
              ))}
            </Visibility>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              iconPosition="start"
              onClick={handleAddNewOptionAnswer}
            >
              Add new option answer
            </Button>
          </div>
        </div>
      )}
      <Visibility
        visibility={
          currentOrder > STARTED_QUESTION_DEFAULT ||
          currentOrder < maxOrderQuestion
        }
      >
        <div className="w-full flex justify-between items-center">
          <Visibility
            visibility={currentOrder > STARTED_QUESTION_DEFAULT}
            boundaryComponent
          >
            <Button
              type="primary"
              icon={<ArrowLeftOutlined />}
              iconPosition="start"
              onClick={() => {
                setCurrentOrder(currentOrder - 1);
              }}
            >
              Previous question
            </Button>
          </Visibility>
          <Visibility
            visibility={currentOrder < maxOrderQuestion}
            boundaryComponent
          >
            <Button
              type="primary"
              icon={<ArrowRightOutlined />}
              iconPosition="end"
              onClick={() => {
                setCurrentOrder(currentOrder + 1);
              }}
            >
              Next question
            </Button>
          </Visibility>
        </div>
      </Visibility>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        iconPosition="start"
        onClick={handleAddNewQuestion}
      >
        Add new question
      </Button>
      <div className="flex flex-row w-full space-x-5">
        <Button
          type="default"
          color="default"
          onClick={() => {
            navigate(-1);
          }}
        >
          Cancel
        </Button>
        <Button type="primary" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
      <GeneralLoading isLoading={loading} />
    </div>
  );
}
