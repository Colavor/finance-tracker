export function getElement<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector);

  if (!element) {
    throw new Error(`Не найден элемент ${selector}`);
  }

  return element;
}

export function getFormValue(formData: FormData, name: string): string {
  const value = formData.get(name);

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Поле "${name}" обязательно`);
  }

  return value.trim();
}

export function getTransactionType(value: string): "income" | "expense" {
  if (value === "income" || value === "expense") {
    return value;
  }

  throw new Error("Некорректный тип транзакции");
}

export function getCategory(
  value: string,
): "food" | "transport" | "entertainment" | "housing" | "other" {
  switch (value) {
    case "food":
    case "transport":
    case "entertainment":
    case "housing":
    case "other":
      return value;

    default:
      throw new Error("Некорректная категория");
  }
}

export function getAmount(value: string): number {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Сумма должна быть больше 0");
  }

  return amount;
}

export function getDate(value: string): number {
  const date = new Date(value).getTime();

  if (!Number.isFinite(date)) {
    throw new Error("Некорректная дата");
  }

  return date;
}

export function getOptionalFormValue(
  formData: FormData,
  name: string,
): string | undefined {
  const value = formData.get(name);

  if (typeof value !== "string") {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue === "" ? undefined : trimmedValue;
}
