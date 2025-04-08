import { IChapter } from './chapter.types';
export interface ICourse {
  _id: string;
  name: string;
  description: string;
  chapters: IChapter[];
  __v: number;
  createdAt: string;
  updatedAt: string;
}
