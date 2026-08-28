import {
  createTransaction,
  addTransaction,
  deleteTransaction,
  calculateBalance,
  getTransactions,
} from "./transactions";

import {
  createTransactionElement,
  addTransactionElement,
  removeTransactionElement,
  openModal,
  closeModal,
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

const balanceCounter = getElement<HTMLSpanElement>("#balance-counter");

function handleTransactionSubmit(event: SubmitEvent): void {
  event.preventDefault();

  try {
    const data = getTransactionFormData(transactionForm);

    const transaction = createTransaction(data);

    addTransaction(transaction);
    addTransactionElement(transaction);

    closeModal(transactionModal);
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    }
  }
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

addTransactionButton.addEventListener("click", () =>
  openModal(transactionModal),
);

closeTransactionButton.addEventListener("click", () => {
  closeModal(transactionModal);
});

transactionForm.addEventListener("submit", handleTransactionSubmit);
