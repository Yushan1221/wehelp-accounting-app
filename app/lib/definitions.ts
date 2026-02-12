export type TransactionType = "income" | "expense";

// 記帳資料
export interface Transaction {
  id: string;
  userId: string;
  text: string; // 項目名稱
  amount: number; // 金額
  type: TransactionType; // 收入 or 支出
  createdAt: Date;
}