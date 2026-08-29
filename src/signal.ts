export class Signal {
  private subscribers: (() => void)[] = [];

  subscribe(callback: () => void): void {
    this.subscribers.push(callback);
  }

  notify(): void {
    this.subscribers.forEach((callback) => callback());
  }
}
