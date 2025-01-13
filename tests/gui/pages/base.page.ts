import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
    readonly page: Page;
    readonly url: string;

    constructor(page: Page, url: string) {
        this.page = page;
        this.url = url;
    }

    async goto() {
        await this.page.goto(this.url);
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }

    async getElementText(locator: Locator): Promise<string> {
        return await locator.textContent() || '';
    }

    async clickElement(locator: Locator) {
        await locator.click();
    }

    async fillInput(locator: Locator, value: string) {
        await locator.fill(value);
    }

    async isElementVisible(locator: Locator): Promise<boolean> {
        return await locator.isVisible();
    }

    async expectElementToBeVisible(locator: Locator) {
        await expect(locator).toBeVisible();
    }

    async expectElementToHaveText(locator: Locator, text: string) {
        await expect(locator).toHaveText(text);
    }
}
