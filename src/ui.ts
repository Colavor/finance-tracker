import type { Transaction } from "./types";
import { getElement, formatMoney } from "./utils";

const transactionsList = getElement<HTMLDivElement>("#transactionsList");
const balanceCounter = getElement<HTMLSpanElement>("#balance-counter");

export function createTransactionElement(
  transaction: Transaction,
): HTMLElement {
  const element = document.createElement("div");
  element.className = "transaction";
  element.dataset.transactionId = String(transaction.id);

  const type = document.createElement("h4");
  const category = document.createElement("p");
  const amount = document.createElement("span");
  const description = document.createElement("span");
  const date = document.createElement("span");

  type.textContent = getTransactionTypeLabel(transaction.type);
  category.textContent = getCategoryLabel(transaction.category);
  description.textContent = transaction.description ?? "Без описания";
  amount.textContent = formatMoney(transaction.amount);
  date.textContent = formatDate(transaction.date);

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.classList.add("edit-btn");

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete-btn");

  const info = document.createElement("div");
  info.className = "transaction__info";

  const actions = document.createElement("div");
  actions.className = "transaction__actions";

  info.append(type, category, amount, description, date);

  actions.append(editBtn, deleteBtn);

  element.append(info, actions);

  return element;
}

function getTransactionTypeLabel(type: Transaction["type"]): string {
  return type === "income" ? "Доход" : "Расход";
}

function getCategoryLabel(category: Transaction["category"]): string {
  switch (category) {
    case "food":
      return "Еда";

    case "transport":
      return "Транспорт";

    case "entertainment":
      return "Развлечения";

    case "housing":
      return "Жильё";

    case "other":
      return "Другое";

    default:
      throw new Error("Неизвестная категория");
  }
}

export function addTransactionElement(transaction: Transaction): void {
  transactionsList.append(createTransactionElement(transaction));
}

export function removeTransactionElement(id: Transaction["id"]): void {
  const element = transactionsList.querySelector<HTMLElement>(
    `[data-transaction-id="${id}"]`,
  );

  element?.remove();
}

export function openModal(modal: HTMLElement): void {
  modal.classList.remove("hidden");
}

export function closeModal(modal: HTMLElement): void {
  modal.classList.add("hidden");

  const form = modal.querySelector<HTMLFormElement>("form");

  form?.reset();
}

function formatDate(date: Transaction["date"]): string {
  return new Date(date).toLocaleDateString("ru-RU");
}

export function updateBalance(balance: number): void {
  balanceCounter.textContent = String(balance);
}

export function updateTransactionElement(transaction: Transaction): void {
  const element = transactionsList.querySelector(
    `[data-transaction-id="${transaction.id}"]`,
  );

  if (!(element instanceof HTMLElement)) {
    throw new Error("Не найден элемент транзакции");
  }

  const newElement = createTransactionElement(transaction);

  element.replaceWith(newElement);
}

export function updateStatistics(
  income: number,
  expenses: number,
  expensesByCategory: Record<Transaction["category"], number>,
  categoryPercentages: Record<Transaction["category"], number>,
): void {
  const totalIncome = getElement<HTMLSpanElement>("#total-income");
  const totalExpenses = getElement<HTMLSpanElement>("#total-expenses");

  const food = getElement<HTMLSpanElement>("#category-food");
  const transport = getElement<HTMLSpanElement>("#category-transport");
  const entertainment = getElement<HTMLSpanElement>("#category-entertainment");
  const housing = getElement<HTMLSpanElement>("#category-housing");
  const other = getElement<HTMLSpanElement>("#category-other");

  const foodPercent = getElement<HTMLSpanElement>("#category-food-percent");
  const transportPercent = getElement<HTMLSpanElement>(
    "#category-transport-percent",
  );
  const entertainmentPercent = getElement<HTMLSpanElement>(
    "#category-entertainment-percent",
  );
  const housingPercent = getElement<HTMLSpanElement>(
    "#category-housing-percent",
  );
  const otherPercent = getElement<HTMLSpanElement>("#category-other-percent");

  totalIncome.textContent = formatMoney(income);
  totalExpenses.textContent = formatMoney(expenses);

  food.textContent = formatMoney(expensesByCategory.food);
  transport.textContent = formatMoney(expensesByCategory.transport);
  entertainment.textContent = formatMoney(expensesByCategory.entertainment);
  housing.textContent = formatMoney(expensesByCategory.housing);
  other.textContent = formatMoney(expensesByCategory.other);

  foodPercent.textContent = `${categoryPercentages.food.toFixed(0)}%`;
  transportPercent.textContent = `${categoryPercentages.transport.toFixed(0)}%`;
  entertainmentPercent.textContent = `${categoryPercentages.entertainment.toFixed(0)}%`;
  housingPercent.textContent = `${categoryPercentages.housing.toFixed(0)}%`;
  otherPercent.textContent = `${categoryPercentages.other.toFixed(0)}%`;
}

export function renderTransactions(transactions: Transaction[]): void {
  transactionsList.replaceChildren();

  transactions.forEach((transaction) => {
    addTransactionElement(transaction);
  });
}
