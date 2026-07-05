class Calculator {
  static #ensureValidNumber(value, argName) {
    if (typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value)) {
      throw new TypeError(`${argName} должно быть конечным числом`);
    }
  }

  add(a, b) {
    Calculator.#ensureValidNumber(a, "a");
    Calculator.#ensureValidNumber(b, "b");
    return a + b;
  }

  subtract(a, b) {
    Calculator.#ensureValidNumber(a, "a");
    Calculator.#ensureValidNumber(b, "b");
    return a - b;
  }

  multiply(a, b) {
    Calculator.#ensureValidNumber(a, "a");
    Calculator.#ensureValidNumber(b, "b");
    return a * b;
  }

  divide(a, b) {
    Calculator.#ensureValidNumber(a, "a");
    Calculator.#ensureValidNumber(b, "b");

    if (b === 0) {
      throw new Error("Деление на ноль запрещено");
    }

    return a / b;
  }
}

export { Calculator };
