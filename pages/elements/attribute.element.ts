import { Locator } from '@playwright/test';

// ========= GET STYLES =========

export async function getElementStyle(
  elementHandle: Locator,
  propertyName: string,
) {
  const style = await elementHandle.evaluate((element, propertyName) => {
    const computedStyle = window.getComputedStyle(element);
    const value = computedStyle[propertyName as keyof CSSStyleDeclaration];
    return {
      value,
    };
  }, propertyName);
  return style;
}
