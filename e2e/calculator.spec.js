import { test, expect } from "@playwright/test";

const CALCULATOR_URL = "/calculator.html";

async function openCalculator(page) {
  await page.goto(CALCULATOR_URL);
  await page.evaluate(() => {
    localStorage.clear();
    location.reload();
  });
  await expect(page.locator("#display")).toHaveValue("0");
}

async function clickDigit(page, digit) {
  await page.locator(`.buttons button[data-value="${digit}"]`).click();
}

async function clickOperator(page, operator) {
  await page.locator(`.buttons button[data-value="${operator}"]`).click();
}

async function clickEquals(page) {
  await page.locator('.buttons button[data-action="equals"]').click();
}

async function clickClear(page) {
  await page.locator('.buttons button[data-action="clear"]').click();
}

async function expectDisplay(page, value) {
  await expect(page.locator("#display")).toHaveValue(value);
}

test.describe("Калькулятор в браузере", () => {
  test.beforeEach(async ({ page }) => {
    await openCalculator(page);
  });

  test("отображает начальное значение 0", async ({ page }) => {
    await expectDisplay(page, "0");
  });

  test("вводит числа через кнопки", async ({ page }) => {
    await clickDigit(page, "1");
    await clickDigit(page, "2");
    await clickDigit(page, "3");

    await expectDisplay(page, "123");
  });

  test("складывает два числа и показывает результат", async ({ page }) => {
    await clickDigit(page, "2");
    await clickOperator(page, "+");
    await clickDigit(page, "3");
    await clickEquals(page);

    await expectDisplay(page, "5");
  });

  test("вычитает числа и показывает результат", async ({ page }) => {
    await clickDigit(page, "9");
    await clickOperator(page, "-");
    await clickDigit(page, "4");
    await clickEquals(page);

    await expectDisplay(page, "5");
  });

  test("умножает числа и показывает результат", async ({ page }) => {
    await clickDigit(page, "6");
    await clickOperator(page, "*");
    await clickDigit(page, "7");
    await clickEquals(page);

    await expectDisplay(page, "42");
  });

  test("делит числа и показывает результат", async ({ page }) => {
    await clickDigit(page, "8");
    await clickOperator(page, "/");
    await clickDigit(page, "2");
    await clickEquals(page);

    await expectDisplay(page, "4");
  });

  test("поддерживает десятичные числа", async ({ page }) => {
    await clickDigit(page, "1");
    await clickDigit(page, ".");
    await clickDigit(page, "5");
    await clickOperator(page, "+");
    await clickDigit(page, "2");
    await clickDigit(page, ".");
    await clickDigit(page, "5");
    await clickEquals(page);

    await expectDisplay(page, "4");
  });

  test("кнопка C сбрасывает ввод и возвращает 0", async ({ page }) => {
    await clickDigit(page, "7");
    await clickOperator(page, "+");
    await clickDigit(page, "1");
    await expectDisplay(page, "7+1");

    await clickClear(page);

    await expectDisplay(page, "0");
  });

  test("после вычисления добавляет запись в журнал операций", async ({ page }) => {
    await clickDigit(page, "2");
    await clickOperator(page, "+");
    await clickDigit(page, "3");
    await clickEquals(page);

    await expect(page.locator("#historyList li").first()).toHaveText("2+3 = 5");
    await expect(page.locator("#historyEmpty")).toBeHidden();
  });
});
