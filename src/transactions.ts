import type { Transaction } from "./types";

const transactions: Transaction[] = [];

export function createTransaction(data: Omit<Transaction, "id">): Transaction {
  const transaction: Transaction = {
    id: Date.now(),
    ...data,
  };

  return transaction;
}

export function addTransaction(transaction: Transaction): void {
  transactions.push(transaction);
}

export function deleteTransaction(id: number): void {
  const index = transactions.findIndex((transaction) => transaction.id === id);

  if (index !== -1) {
    transactions.splice(index, 1);
  }
}

export function calculateBalance(): number {
  return transactions.reduce((acc, transaction) => {
    return transaction.type === "income"
      ? acc + transaction.amount
      : acc - transaction.amount;
  }, 0);
}

export function getTransactions(): Transaction[] {
  return [...transactions];
}
