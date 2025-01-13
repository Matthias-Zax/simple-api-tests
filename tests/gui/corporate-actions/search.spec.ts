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

    test('T1_GUI_Search_BasicSearch_DisplaysResults', async () => {
        // Perform basic search
        await searchPage.search('DVCA');
        
        // Verify results are displayed
        const results = await searchPage.getSearchResults();
        expect(results.length).toBeGreaterThan(0);
    });

    test('T2_GUI_Search_DateFilter_FiltersByDateRange', async () => {
        // Set date range
        await searchPage.setDateRange('2025-01-01', '2025-01-13');
        
        // Perform search
        await searchPage.search('');
        
        // Verify results
        const results = await searchPage.getSearchResults();
        expect(results.length).toBeGreaterThan(0);
    });

    test('T3_GUI_Search_NoResults_DisplaysMessage', async () => {
        // Search with non-existing term
        await searchPage.search('NONEXISTENT_TERM_123');
        
        // Verify no results message
        expect(await searchPage.hasNoResults()).toBeTruthy();
    });

    test('T4_GUI_Search_Pagination_NavigatesThroughResults', async () => {
        // Perform search that returns multiple pages
        await searchPage.search('');
        
        // Get results from first page
        const firstPageResults = await searchPage.getSearchResults();
        
        // Navigate to next page
        await searchPage.goToNextPage();
        
        // Get results from second page
        const secondPageResults = await searchPage.getSearchResults();
        
        // Verify different results
        expect(firstPageResults).not.toEqual(secondPageResults);
    });

    test('T5_GUI_Search_ClickResult_NavigatesToDetails', async ({ page }) => {
        // Perform search
        await searchPage.search('DVCA');
        
        // Click first result
        const results = searchPage.resultsTable.locator('tr');
        await results.first().click();
        
        // Verify navigation to details page
        await expect(page).toHaveURL(/.*\/details\/.*/);
        
        // Verify details content
        await detailsPage.expectElementToBeVisible(detailsPage.detailsContainer);
    });
});
