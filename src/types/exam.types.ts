import { IChapter } from './chapter.types';

export type TLevel = 'EASY' | 'MEDIUM' | 'HARD';

export type TExamType = 'MCQ' | 'ARRANGE';

export interface IExam {
  _id: string;
  chapterId: string;
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
  chapterId: IChapter | string;
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
  type: TExamType;
  content: string;
  order: number;
  options: IOption[];
  correctAnswer: string | string[];
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
  type: TExamType;
  content: string;
  order: number;
  options: IOptionsLocal[];
  correctAnswer: any;
  isInitialOrder?: boolean;
}

export interface IOptionsLocal {
  id: number | string;
  content: string;
}
