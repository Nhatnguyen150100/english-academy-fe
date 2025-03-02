export interface IUser {
  _id: string;
  email: string;
  name: string;
  role: IRole;
  phone_number: string;
  score: number;
  accountType: "FREE" | "PREMIUM";
  address: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface IQueryUser {
  page: number;
  limit: number;
  total: number;
  name: string;
}

export type IRole = 'USER' | 'ADMIN';
