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
  comments: IComment[];
  likes: string[];
}

export type IBlogDetail = IBlogInfo & {
  userId: IUser;
  content: string;
};

export interface IComment {
  userId: IUser;
  commentText: string;
  createdAt: string;
}
