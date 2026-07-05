import { describe, it, expect, beforeEach } from "vitest";
import { Calculator } from "../src/Calculator.js";

describe("Calculator", () => {
  let calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe("add", () => {
    it("складывает два положительных числа", () => {
      expect(calculator.add(5, 7)).toBe(12);
    });

    it("корректно складывает отрицательное и положительное число", () => {
      expect(calculator.add(-10, 4)).toBe(-6);
    });

    it("выбрасывает ошибку для нечислового аргумента", () => {
      expect(() => calculator.add("5", 2)).toThrow(TypeError);
    });
  });

  describe("subtract", () => {
    it("вычитает второе число из первого", () => {
      expect(calculator.subtract(10, 3)).toBe(7);
    });

    it("корректно работает с отрицательными числами", () => {
      expect(calculator.subtract(-5, -8)).toBe(3);
    });

    it("выбрасывает ошибку для NaN", () => {
      expect(() => calculator.subtract(Number.NaN, 2)).toThrow(TypeError);
    });
  });

  describe("multiply", () => {
    it("умножает положительные числа", () => {
      expect(calculator.multiply(6, 7)).toBe(42);
    });

    it("умножение на ноль возвращает ноль", () => {
      expect(calculator.multiply(999, 0)).toBe(0);
    });

    it("выбрасывает ошибку для бесконечности", () => {
      expect(() => calculator.multiply(Infinity, 2)).toThrow(TypeError);
    });
  });

  describe("divide", () => {
    it("делит одно число на другое", () => {
      expect(calculator.divide(20, 5)).toBe(4);
    });

    it("возвращает дробный результат при необходимости", () => {
      expect(calculator.divide(7, 2)).toBe(3.5);
    });

    it("выбрасывает ошибку при делении на ноль", () => {
      expect(() => calculator.divide(10, 0)).toThrow("Деление на ноль запрещено");
    });

    it("выбрасывает ошибку для нечислового делителя", () => {
      expect(() => calculator.divide(10, "2")).toThrow(TypeError);
    });
  });
});
