import type { Transaction } from "./types";

export function saveTransactions(transactions: Transaction[]): void {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

export function loadTransactions(): Transaction[] {
  const data = localStorage.getItem("transactions");

  if (!data) {
    return [];
  }

  const parsed: unknown = JSON.parse(data);

  if (!isTransactionArray(parsed)) {
    throw new Error("Некорректные данные транзакций");
  }

  return parsed;
}

function isTransactionArray(value: unknown): value is Transaction[] {
  return Array.isArray(value) && value.every(isTransaction);
}

function isTransaction(value: unknown): value is Transaction {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    "id" in value &&
    typeof value.id === "number" &&
    "type" in value &&
    (value.type === "income" || value.type === "expense") &&
    "amount" in value &&
    typeof value.amount === "number" &&
    "category" in value &&
    typeof value.category === "string" &&
    "date" in value &&
    typeof value.date === "number"
  );
}
