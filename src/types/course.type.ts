import { IExam } from "./exam.types";

export interface ICourse {
  _id: string;
  name: string;
  description: string;
  exams: IExam[];
  __v: number;
  createdAt: string;
  updatedAt: string;
}