export interface IPagination<T> {
  data: Array<T>;
  total: number;
  page: number;
  totalPages: number;
}