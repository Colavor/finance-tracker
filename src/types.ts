export type TransactionType = "income" | "expense";

export type Category =
  | "food"
  | "transport"
  | "entertainment"
  | "housing"
  | "other";

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  category: Category;
  description?: string;
  date: number;
}
