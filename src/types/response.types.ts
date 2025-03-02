export interface IBaseResponse<T> {
  data: T;
  message: string;
}

export interface IBaseResponseList<T> {
  content: T;
  totalCount: number;
}
