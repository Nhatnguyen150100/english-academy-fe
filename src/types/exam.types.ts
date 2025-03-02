export type TLevel = "EASY" | "MEDIUM" | "HARD"

export interface IExam {
  _id: string;
  courseId: string;
  name: string;
  description: string;
  timeExam: number;
  level: TLevel;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface IExamDetail {
  _id: string;
  courseId: string;
  name: string;
  description: string;
  timeExam: number;
  level: TLevel;
  questions: IQuestion[];
  __v: number;
  createdAt: string;
  updatedAt: string;
  isCompleted: boolean;
}

export interface IOption {
  content: string;
  _id: string;
}

export interface IQuestion {
  content: string;
  order: number;
  options: IOption[];
  correctAnswer: string;
  _id: string;
}

export type TExamInfo = Pick<
  IExam,
  'name' | 'level' | 'timeExam' | 'description'
>;


export interface IExamRequest {
  name: string;
  timeFinish: number;
  level: string;
  description: string;
  questions: IQuestionRequest[];
}

export interface IQuestionRequest {
  content: string;
  order: number;
  options: IOptionsLocal[];
  correctAnswer: string;
}

export interface IOptionsLocal {
  id: number,
  content: string,
}