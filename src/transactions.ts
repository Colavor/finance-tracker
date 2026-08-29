import type { Transaction } from "./types";
import { loadTransactions, saveTransactions } from "./storage";

const transactions: Transaction[] = loadTransactions();

export function createTransaction(data: Omit<Transaction, "id">): Transaction {
  const transaction: Transaction = {
    id: Date.now(),
    ...data,
  };

  return transaction;
}

export function addTransaction(transaction: Transaction): void {
  transactions.push(transaction);
  saveTransactions(transactions);
}

export function deleteTransaction(id: number): void {
  const index = transactions.findIndex((transaction) => transaction.id === id);

  if (index !== -1) {
    transactions.splice(index, 1);
    saveTransactions(transactions);
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

export function updateTransaction(
  transaction: Transaction,
  data: Omit<Transaction, "id">,
): void {
  Object.assign(transaction, data);
  saveTransactions(transactions);
}
