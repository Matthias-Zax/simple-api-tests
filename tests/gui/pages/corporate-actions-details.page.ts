import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class CorporateActionsDetailsPage extends BasePage {
    // Header Elements
    readonly headerTitle: Locator;
    readonly backButton: Locator;
    readonly refreshButton: Locator;
    readonly exportButton: Locator;
    readonly statusBadge: Locator;

    // Navigation Elements
    readonly tabList: Locator;
    readonly breadcrumbs: Locator;

    // Content Elements
    readonly detailsContainer: Locator;
    readonly loadingSpinner: Locator;
    readonly errorMessage: Locator;

    // Details Sections
    readonly generalInfoSection: Locator;
    readonly positionsSection: Locator;
    readonly messagesSection: Locator;
    readonly historySection: Locator;

    constructor(page: Page) {
        super(page, '/corporate-actions/details');
        
        // Initialize Header Elements
        this.headerTitle = page.locator('h1.page-title');
        this.backButton = page.getByRole('button', { name: 'Back' });
        this.refreshButton = page.getByRole('button', { name: 'Refresh' });
        this.exportButton = page.getByRole('button', { name: 'Export' });
        this.statusBadge = page.locator('gds-badge.status-badge');

        // Initialize Navigation Elements
        this.tabList = page.locator('gds-tabs.details-tabs');
        this.breadcrumbs = page.locator('gds-breadcrumbs');

        // Initialize Content Elements
        this.detailsContainer = page.locator('.details-container');
        this.loadingSpinner = page.locator('.loading-spinner');
        this.errorMessage = page.locator('.error-message');

        // Initialize Details Sections
        this.generalInfoSection = page.locator('section.general-info');
        this.positionsSection = page.locator('section.positions');
        this.messagesSection = page.locator('section.messages');
        this.historySection = page.locator('section.history');
    }

    async getDetailsById(id: string) {
        await this.goto();
        await this.page.goto(`${this.url}/${id}`);
        await this.waitForDetailsLoad();
    }

    async waitForDetailsLoad() {
        await this.page.waitForSelector('.loading-spinner', { state: 'hidden' });
    }

    async getStatus(): Promise<string> {
        return await this.getElementText(this.statusBadge);
    }

    async selectTab(tabName: string) {
        const tab = this.tabList.getByRole('tab', { name: tabName });
        await this.clickElement(tab);
        await this.waitForDetailsLoad();
    }

    async exportDetails() {
        const downloadPromise = this.page.waitForEvent('download');
        await this.clickElement(this.exportButton);
        return await downloadPromise;
    }

    async refreshDetails() {
        await this.clickElement(this.refreshButton);
        await this.waitForDetailsLoad();
    }

    async navigateBack() {
        await this.clickElement(this.backButton);
    }

    async getGeneralInfo(): Promise<Record<string, string>> {
        const info: Record<string, string> = {};
        const fields = this.generalInfoSection.locator('.info-field');
        const count = await fields.count();
        
        for (let i = 0; i < count; i++) {
            const field = fields.nth(i);
            const label = await field.locator('.field-label').textContent();
            const value = await field.locator('.field-value').textContent();
            if (label && value) {
                info[label.trim()] = value.trim();
            }
        }
        
        return info;
    }

    async getPositions(): Promise<string[]> {
        const positions: string[] = [];
        const rows = this.positionsSection.locator('tbody tr');
        const count = await rows.count();
        
        for (let i = 0; i < count; i++) {
            const text = await rows.nth(i).textContent();
            if (text) positions.push(text.trim());
        }
        
        return positions;
    }

    async getMessages(): Promise<string[]> {
        const messages: string[] = [];
        const rows = this.messagesSection.locator('tbody tr');
        const count = await rows.count();
        
        for (let i = 0; i < count; i++) {
            const text = await rows.nth(i).textContent();
            if (text) messages.push(text.trim());
        }
        
        return messages;
    }

    async getHistory(): Promise<string[]> {
        const history: string[] = [];
        const rows = this.historySection.locator('tbody tr');
        const count = await rows.count();
        
        for (let i = 0; i < count; i++) {
            const text = await rows.nth(i).textContent();
            if (text) history.push(text.trim());
        }
        
        return history;
    }

    async getBreadcrumbPath(): Promise<string[]> {
        const items = this.breadcrumbs.locator('.breadcrumb-item');
        const path: string[] = [];
        const count = await items.count();
        
        for (let i = 0; i < count; i++) {
            const text = await items.nth(i).textContent();
            if (text) path.push(text.trim());
        }
        
        return path;
    }

    async hasError(): Promise<boolean> {
        return await this.errorMessage.isVisible();
    }

    async getErrorMessage(): Promise<string> {
        return await this.getElementText(this.errorMessage);
    }
}
