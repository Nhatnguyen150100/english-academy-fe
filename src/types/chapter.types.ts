import { IExam } from './exam.types';

export interface IChapter {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  exams: IExam[];
  order: number;
  __v: number;
  createdAt: string;
  updatedAt: string;
}
