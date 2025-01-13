import { test, expect } from '@playwright/test';
import { CorporateActionsSearchPage } from '../pages/corporate-actions-search.page';
import { CorporateActionsDetailsPage } from '../pages/corporate-actions-details.page';

test.describe('Corporate Actions Search', () => {
    let searchPage: CorporateActionsSearchPage;
    let detailsPage: CorporateActionsDetailsPage;

    test.beforeEach(async ({ page }) => {
        searchPage = new CorporateActionsSearchPage(page);
        detailsPage = new CorporateActionsDetailsPage(page);
        await searchPage.goto();
    });

    test('should perform basic search and navigate to details', async ({ page }) => {
        // Perform search
        const searchQuery = 'DVCA';
        await searchPage.search(searchQuery);

        // Verify search results
        const results = await searchPage.getSearchResults();
        expect(results.length).toBeGreaterThan(0);

        // Get column headers and verify essential columns
        const headers = await searchPage.getColumnHeaders();
        expect(headers).toContain('CAEV');
        expect(headers).toContain('Status');
        expect(headers).toContain('ISIN');

        // Click first result to navigate to details
        await page.click('tbody tr:first-child');
        
        // Verify navigation to details page
        const breadcrumbs = await detailsPage.getBreadcrumbPath();
        expect(breadcrumbs).toContain('Corporate Actions');
        expect(breadcrumbs).toContain('Details');

        // Verify details content
        const generalInfo = await detailsPage.getGeneralInfo();
        expect(generalInfo).toBeDefined();
        expect(generalInfo['CAEV']).toBeDefined();

        // Verify status is visible
        const status = await detailsPage.getStatus();
        expect(status).toBeTruthy();

        // Navigate back to search
        await detailsPage.navigateBack();
        
        // Verify back on search page
        await expect(page).toHaveURL(/.*\/corporate-actions\/search/);
    });
});
