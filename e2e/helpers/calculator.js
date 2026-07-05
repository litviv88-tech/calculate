import { expect } from "@playwright/test";

export const CALCULATOR_URL = "/calculator.html";

export async function openCalculator(page) {
  await page.goto(CALCULATOR_URL);
  await page.evaluate(() => {
    localStorage.clear();
    location.reload();
  });
  await expect(page.locator("#display")).toHaveValue("0");
}

export async function clickDigit(page, digit) {
  await page.locator(`.buttons button[data-value="${digit}"]`).click();
}

export async function clickOperator(page, operator) {
  await page.locator(`.buttons button[data-value="${operator}"]`).click();
}

export async function clickEquals(page) {
  await page.locator('.buttons button[data-action="equals"]').click();
}

export async function clickClear(page) {
  await page.locator('.buttons button[data-action="clear"]').click();
}

export async function expectDisplay(page, value) {
  await expect(page.locator("#display")).toHaveValue(value);
}

export async function enterExpression(page, digits) {
  for (const digit of digits) {
    if ("+-*/".includes(digit)) {
      await clickOperator(page, digit);
    } else {
      await clickDigit(page, digit);
    }
  }
}
