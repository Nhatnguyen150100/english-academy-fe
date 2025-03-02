export interface ITest {
  id: string;
  name: string;
  timeFinish: number;
  level: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  score: number;
}

export interface IProcess {
  level: string;
  count: number;
  total: number;
}