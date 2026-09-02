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

//f for statistics
export function calculateTotal(type: Transaction["type"]): number {
  return transactions.reduce(
    (acc, transaction) =>
      transaction.type === type ? acc + transaction.amount : acc,
    0,
  );
}

export function calculateExpensesByCategory(): Record<
  Transaction["category"],
  number
> {
  return transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === "expense") {
        acc[transaction.category] += transaction.amount;
      }
      return acc;
    },
    {
      food: 0,
      transport: 0,
      entertainment: 0,
      housing: 0,
      other: 0,
    },
  );
}
