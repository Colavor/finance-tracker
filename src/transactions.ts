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

export function calculateCategoryPercentages(): Record<
  Transaction["category"],
  number
> {
  const expensesByCategory = calculateExpensesByCategory();
  const totalExpenses = calculateTotal("expense");

  if (totalExpenses === 0) {
    return { food: 0, transport: 0, entertainment: 0, housing: 0, other: 0 };
  }

  return {
    food: (expensesByCategory.food / totalExpenses) * 100,
    transport: (expensesByCategory.transport / totalExpenses) * 100,
    entertainment: (expensesByCategory.entertainment / totalExpenses) * 100,
    housing: (expensesByCategory.housing / totalExpenses) * 100,
    other: (expensesByCategory.other / totalExpenses) * 100,
  };
}

export function searchTransactions(query: string): Transaction[] {
  const normilizedQuery = query.toLocaleLowerCase().trim();

  return transactions.filter((transaction) => {
    const description = transaction.description?.toLowerCase() ?? "";
    const amount = String(transaction.amount);
    const category = transaction.category.toLowerCase();

    return (
      description.includes(normilizedQuery) ||
      amount.includes(normilizedQuery) ||
      category.includes(normilizedQuery)
    );
  });
}
