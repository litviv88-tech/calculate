import { test, expect } from "@playwright/test";
import {
  openCalculator,
  clickDigit,
  clickOperator,
  clickEquals,
  clickClear,
  expectDisplay,
  enterExpression,
} from "./helpers/calculator.js";

test.describe("Калькулятор", () => {
  test.beforeEach(async ({ page }) => {
    await openCalculator(page);
  });

  test.describe("Ввод чисел", () => {
    test("должен отображать введенное число", async ({ page }) => {
      await clickDigit(page, "5");
      await expectDisplay(page, "5");
    });

    test("должен отображать многоразрядное число", async ({ page }) => {
      await clickDigit(page, "1");
      await clickDigit(page, "2");
      await clickDigit(page, "3");
      await expectDisplay(page, "123");
    });

    test("должен отображать ноль при первом вводе", async ({ page }) => {
      await expectDisplay(page, "0");
    });

    test("должен заменять ноль на первую цифру", async ({ page }) => {
      await clickDigit(page, "7");
      await expectDisplay(page, "7");
    });

    test("должен добавлять десятичную точку", async ({ page }) => {
      await clickDigit(page, "1");
      await clickDigit(page, ".");
      await expectDisplay(page, "1.");
    });

    test("должен добавлять цифры после десятичной точки", async ({ page }) => {
      await clickDigit(page, "1");
      await clickDigit(page, ".");
      await clickDigit(page, "5");
      await expectDisplay(page, "1.5");
    });

    test("не должен добавлять вторую десятичную точку в одном числе", async ({ page }) => {
      await clickDigit(page, "1");
      await clickDigit(page, ".");
      await clickDigit(page, "2");
      await clickDigit(page, ".");
      await expectDisplay(page, "1.2");
    });

    test("должен добавлять десятичную точку к нулю", async ({ page }) => {
      await clickDigit(page, ".");
      await expectDisplay(page, ".");
    });
  });

  test.describe("Операции", () => {
    test("должен добавлять оператор сложения", async ({ page }) => {
      await clickDigit(page, "2");
      await clickOperator(page, "+");
      await expectDisplay(page, "2+");
    });

    test("должен добавлять оператор вычитания", async ({ page }) => {
      await clickDigit(page, "2");
      await clickOperator(page, "-");
      await expectDisplay(page, "2-");
    });

    test("должен добавлять оператор умножения", async ({ page }) => {
      await clickDigit(page, "2");
      await clickOperator(page, "*");
      await expectDisplay(page, "2*");
    });

    test("должен добавлять оператор деления", async ({ page }) => {
      await clickDigit(page, "2");
      await clickOperator(page, "/");
      await expectDisplay(page, "2/");
    });

    test("не должен добавлять оператор в пустое выражение", async ({ page }) => {
      await clickOperator(page, "+");
      await expectDisplay(page, "0");
    });

    test("должен заменять последний оператор при повторном нажатии", async ({ page }) => {
      await clickDigit(page, "2");
      await clickOperator(page, "+");
      await clickOperator(page, "-");
      await expectDisplay(page, "2-");
    });
  });

  test.describe("Вычисление", () => {
    test("должен складывать два числа", async ({ page }) => {
      await enterExpression(page, "2+3");
      await clickEquals(page);
      await expectDisplay(page, "5");
    });

    test("должен вычитать числа", async ({ page }) => {
      await enterExpression(page, "9-4");
      await clickEquals(page);
      await expectDisplay(page, "5");
    });

    test("должен умножать числа", async ({ page }) => {
      await enterExpression(page, "6*7");
      await clickEquals(page);
      await expectDisplay(page, "42");
    });

    test("должен делить числа", async ({ page }) => {
      await enterExpression(page, "8/2");
      await clickEquals(page);
      await expectDisplay(page, "4");
    });

    test("должен вычислять выражение с десятичными числами", async ({ page }) => {
      await enterExpression(page, "1.5+2.5");
      await clickEquals(page);
      await expectDisplay(page, "4");
    });

    test("должен вычислять цепочку операций", async ({ page }) => {
      await enterExpression(page, "2+3*4");
      await clickEquals(page);
      await expectDisplay(page, "14");
    });

    test("должен показывать ошибку при делении на ноль", async ({ page }) => {
      await enterExpression(page, "5/0");
      await clickEquals(page);
      await expectDisplay(page, "Infinity");
    });
  });

  test.describe("Очистка", () => {
    test("должен сбрасывать выражение кнопкой C", async ({ page }) => {
      await enterExpression(page, "7+1");
      await expectDisplay(page, "7+1");

      await clickClear(page);

      await expectDisplay(page, "0");
    });

    test("должен позволять вводить новое выражение после сброса", async ({ page }) => {
      await enterExpression(page, "9*9");
      await clickClear(page);
      await clickDigit(page, "3");
      await expectDisplay(page, "3");
    });
  });

  test.describe("Журнал операций", () => {
    test("должен добавлять запись после вычисления", async ({ page }) => {
      await enterExpression(page, "2+3");
      await clickEquals(page);

      await expect(page.locator("#historyList li").first()).toHaveText("2+3 = 5");
      await expect(page.locator("#historyEmpty")).toBeHidden();
    });

    test("должен очищать журнал по кнопке Очистить", async ({ page }) => {
      await enterExpression(page, "1+1");
      await clickEquals(page);

      await page.locator("#historyClear").click();

      await expect(page.locator("#historyList li")).toHaveCount(0);
      await expect(page.locator("#historyEmpty")).toBeVisible();
    });
  });
});
