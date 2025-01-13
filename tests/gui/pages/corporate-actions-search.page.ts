import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class CorporateActionsSearchPage extends BasePage {
    // Header Elements
    readonly pageTitle: Locator;
    readonly refreshButton: Locator;
    readonly exportButton: Locator;

    // Search Form Elements
    readonly searchForm: Locator;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly advancedSearchButton: Locator;

    // Filter Elements
    readonly filterSection: Locator;
    readonly dateFromInput: Locator;
    readonly dateToInput: Locator;
    readonly statusDropdown: Locator;
    readonly caevDropdown: Locator;
    readonly clearFiltersButton: Locator;

    // Results Elements
    readonly resultsTable: Locator;
    readonly loadingSpinner: Locator;
    readonly noResultsMessage: Locator;
    readonly paginationContainer: Locator;
    readonly paginationNext: Locator;
    readonly paginationPrev: Locator;
    readonly rowsPerPageDropdown: Locator;

    constructor(page: Page) {
        super(page, '/corporate-actions/search');
        
        // Initialize Header Elements
        this.pageTitle = page.locator('h1.page-title');
        this.refreshButton = page.getByRole('button', { name: 'Refresh' });
        this.exportButton = page.getByRole('button', { name: 'Export' });

        // Initialize Search Form Elements
        this.searchForm = page.locator('form.search-form');
        this.searchInput = page.getByPlaceholder('Search corporate actions...');
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.advancedSearchButton = page.getByRole('button', { name: 'Advanced Search' });

        // Initialize Filter Elements
        this.filterSection = page.locator('.filter-section');
        this.dateFromInput = page.getByLabel('From Date');
        this.dateToInput = page.getByLabel('To Date');
        this.statusDropdown = page.locator('gds-select[formControlName="status"]');
        this.caevDropdown = page.locator('gds-select[formControlName="caev"]');
        this.clearFiltersButton = page.getByRole('button', { name: 'Clear Filters' });

        // Initialize Results Elements
        this.resultsTable = page.locator('gds-table.results-table');
        this.loadingSpinner = page.locator('.loading-spinner');
        this.noResultsMessage = page.locator('.no-results-message');
        this.paginationContainer = page.locator('.pagination-container');
        this.paginationNext = page.getByRole('button', { name: 'Next page' });
        this.paginationPrev = page.getByRole('button', { name: 'Previous page' });
        this.rowsPerPageDropdown = page.locator('gds-select[formControlName="pageSize"]');
    }

    async search(query: string) {
        await this.fillInput(this.searchInput, query);
        await this.clickElement(this.searchButton);
        await this.waitForSearchResults();
    }

    async setDateRange(fromDate: string, toDate: string) {
        await this.fillInput(this.dateFromInput, fromDate);
        await this.fillInput(this.dateToInput, toDate);
    }

    async selectStatus(status: string) {
        await this.statusDropdown.selectOption(status);
        await this.waitForSearchResults();
    }

    async selectCaev(caev: string) {
        await this.caevDropdown.selectOption(caev);
        await this.waitForSearchResults();
    }

    async clearFilters() {
        await this.clickElement(this.clearFiltersButton);
        await this.waitForSearchResults();
    }

    async waitForSearchResults() {
        await this.page.waitForSelector('.loading-spinner', { state: 'hidden' });
    }

    async getSearchResults(): Promise<string[]> {
        const rows = this.resultsTable.locator('tbody tr');
        const results: string[] = [];
        const count = await rows.count();
        
        for (let i = 0; i < count; i++) {
            const text = await rows.nth(i).textContent();
            if (text) results.push(text.trim());
        }
        
        return results;
    }

    async setRowsPerPage(count: string) {
        await this.rowsPerPageDropdown.selectOption(count);
        await this.waitForSearchResults();
    }

    async goToNextPage() {
        if (await this.paginationNext.isEnabled()) {
            await this.clickElement(this.paginationNext);
            await this.waitForSearchResults();
        }
    }

    async goToPreviousPage() {
        if (await this.paginationPrev.isEnabled()) {
            await this.clickElement(this.paginationPrev);
            await this.waitForSearchResults();
        }
    }

    async hasNoResults(): Promise<boolean> {
        return await this.noResultsMessage.isVisible();
    }

    async exportResults() {
        const downloadPromise = this.page.waitForEvent('download');
        await this.clickElement(this.exportButton);
        return await downloadPromise;
    }

    async refreshResults() {
        await this.clickElement(this.refreshButton);
        await this.waitForSearchResults();
    }

    async toggleAdvancedSearch() {
        await this.clickElement(this.advancedSearchButton);
    }

    async getColumnHeaders(): Promise<string[]> {
        const headers = this.resultsTable.locator('thead th');
        const headerTexts: string[] = [];
        const count = await headers.count();
        
        for (let i = 0; i < count; i++) {
            const text = await headers.nth(i).textContent();
            if (text) headerTexts.push(text.trim());
        }
        
        return headerTexts;
    }
}
