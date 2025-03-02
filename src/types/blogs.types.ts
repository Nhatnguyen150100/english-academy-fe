import { IUser } from './user.types';

export type TStatusBlog = 'PENDING_APPROVED' | 'APPROVED' | 'REJECTED';

export interface IBlogInfo {
  _id: string;
  userId: string;
  title: string;
  thumbnail: string;
  description: string;
  statusBlog: TStatusBlog;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export type IBlogDetail = IBlogInfo & {
  userId: IUser;
  content: string;
};
