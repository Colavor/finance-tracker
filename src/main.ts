import "./style.css";
import {
  createTransaction,
  addTransaction,
  deleteTransaction,
  calculateBalance,
  getTransactions,
  updateTransaction,
  calculateTotal,
  calculateExpensesByCategory,
  searchTransactions,
  calculateCategoryPercentages,
} from "./transactions";

import {
  addTransactionElement,
  removeTransactionElement,
  openModal,
  closeModal,
  updateBalance,
  updateTransactionElement,
  updateStatistics,
  renderTransactions,
} from "./ui";

import type { Transaction } from "./types";

import {
  getElement,
  getFormValue,
  getCategory,
  getTransactionType,
  getAmount,
  getDate,
  getOptionalFormValue,
} from "./utils";

import { Signal } from "./signal";

const addTransactionButton = getElement<HTMLButtonElement>(
  "#addTransactionButton",
);
const closeTransactionButton = getElement<HTMLButtonElement>(
  "#closeTransactionModal",
);
const transactionForm = getElement<HTMLFormElement>("#transactionForm");
const transactionModal = getElement<HTMLDivElement>(
  '[data-modal="transaction"]',
);
const transactionsList = getElement<HTMLDivElement>("#transactionsList");
const searchInput = getElement<HTMLInputElement>("#searchInput");

function refreshBalance(): void {
  updateBalance(calculateBalance());
}

function refreshStatistics(): void {
  updateStatistics(
    calculateTotal("income"),
    calculateTotal("expense"),
    calculateExpensesByCategory(),
    calculateCategoryPercentages(),
  );
}

const transactionsChanged = new Signal();
transactionsChanged.subscribe(() => refreshBalance());
transactionsChanged.subscribe(() => refreshStatistics());

function handleTransactionSubmit(event: SubmitEvent): void {
  event.preventDefault();

  try {
    const data = getTransactionFormData(transactionForm);

    if (editingTransaction) {
      updateTransaction(editingTransaction, data);
      updateTransactionElement(editingTransaction);
      transactionsChanged.notify();
      closeModal(transactionModal);
      editingTransaction = null;
      return;
    }

    const transaction = createTransaction(data);

    addTransaction(transaction);
    addTransactionElement(transaction);
    transactionsChanged.notify();
    closeModal(transactionModal);
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    }
  }
}

let editingTransaction: Transaction | null = null;

function handleTransactionClick(event: MouseEvent): void {
  const target = event.target;

  if (!(target instanceof HTMLElement)) return;

  const transactionElement = target.closest(".transaction");

  if (!(transactionElement instanceof HTMLElement)) return;

  const transactionId = Number(transactionElement.dataset.transactionId);

  if (target.classList.contains("delete-btn")) {
    const isConfirmed = confirm("Delete this transaction?");
    if (!isConfirmed) return;

    deleteTransaction(transactionId);
    removeTransactionElement(transactionId);
    transactionsChanged.notify();
  }

  if (target.classList.contains("edit-btn")) {
    const transaction = getTransactions().find(
      (transaction) => transaction.id === transactionId,
    );

    if (!transaction) return;

    editingTransaction = transaction;

    fillTransactionForm(transaction);
    openModal(transactionModal);
  }
}

function fillTransactionForm(transaction: Transaction): void {
  const type = transactionForm.elements.namedItem("type");
  const amount = transactionForm.elements.namedItem("amount");
  const category = transactionForm.elements.namedItem("category");
  const description = transactionForm.elements.namedItem("description");
  const date = transactionForm.elements.namedItem("date");

  if (
    !(type instanceof HTMLSelectElement) ||
    !(amount instanceof HTMLInputElement) ||
    !(category instanceof HTMLSelectElement) ||
    !(description instanceof HTMLInputElement) ||
    !(date instanceof HTMLInputElement)
  ) {
    throw new Error("Некорректная структура формы");
  }

  type.value = transaction.type;
  amount.value = String(transaction.amount);
  category.value = transaction.category;
  description.value = transaction.description ?? "";
  date.value = new Date(transaction.date).toISOString().split("T")[0];
}

function getTransactionFormData(
  form: HTMLFormElement,
): Omit<Transaction, "id"> {
  const formData = new FormData(form);

  const type = getTransactionType(getFormValue(formData, "type"));
  const amount = getAmount(getFormValue(formData, "amount"));
  const category = getCategory(getFormValue(formData, "category"));
  const description = getOptionalFormValue(formData, "description");
  const date = getDate(getFormValue(formData, "date"));

  return {
    type,
    amount,
    category,
    description,
    date,
  };
}

const dateInput = getElement<HTMLInputElement>("#date-modal");

function getTodayDate(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function setDefaultDate(): void {
  dateInput.value = getTodayDate();
}

function handleSearchInput(): void {
  const query = searchInput.value;
  const filteredTransactions = searchTransactions(query);

  renderTransactions(filteredTransactions);
}

searchInput.addEventListener("input", handleSearchInput);

addTransactionButton.addEventListener("click", () => {
  setDefaultDate();
  openModal(transactionModal);
});

closeTransactionButton.addEventListener("click", () => {
  closeModal(transactionModal);
});

transactionForm.addEventListener("submit", handleTransactionSubmit);

transactionsList.addEventListener("click", handleTransactionClick);

getTransactions().forEach(addTransactionElement);
refreshBalance();
refreshStatistics();
