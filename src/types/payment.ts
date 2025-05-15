export interface IPaymentStatistic {
  type: string;
  totalAmount: number;
  stats: Stat[];
}

export interface Stat {
  month: string;
  totalAmount: number;
}
