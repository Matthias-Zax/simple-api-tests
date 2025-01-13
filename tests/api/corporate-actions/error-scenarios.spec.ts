import { test, expect } from '../fixtures/test-fixtures';
import { corporateActionsTestData as testData } from '../../test-data/corporate-actions.data';
import { GIGParamsInBody } from '../../test-data/interfaces/api-interfaces';

test.describe('Corporate Actions Error Scenarios', () => {
    test('T4_SearchCorporateActions_InvalidIsin_Returns400', async ({ request }) => {
        const response = await request.get('/corporateActions/canspa', {
            params: {
                isin: testData.invalid.isin,
                page: testData.defaults.page,
                pageSize: testData.defaults.pageSize
            }
        });
        
        expect(response.status()).toBe(400);
        const errorBody = await response.json();
        expect(errorBody).toHaveProperty('message');
        expect(errorBody.message).toContain('Invalid ISIN');
    });

    test('T4_GetCorpRef_NonExistentId_Returns404', async ({ request }) => {
        const response = await request.get(`/corporateActionsData/corpRef/${testData.invalid.zspaId}`);
        
        expect(response.status()).toBe(404);
        const errorBody = await response.json();
        expect(errorBody).toHaveProperty('message');
    });

    test('T4_GetDetails_InvalidZspaIdFormat_Returns400', async ({ request }) => {
        const response = await request.get('/corporateActionsData/details', {
            params: {
                zspaId: testData.invalid.invalidFormat.zspaId
            }
        });
        
        expect(response.status()).toBe(400);
        const errorBody = await response.json();
        expect(errorBody).toHaveProperty('message');
    });

    test('T4_SearchCorporateActions_MissingRequiredParams_Returns400', async ({ request }) => {
        const response = await request.get('/corporateActions/canspa', {
            params: {
                page: testData.defaults.page,
                pageSize: testData.defaults.pageSize
            }
        });
        
        expect(response.status()).toBe(400);
        const errorBody = await response.json();
        expect(errorBody).toHaveProperty('message');
    });

    test('T4_SearchWithPositions_InvalidDateFormat_Returns400', async ({ request }) => {
        const gigParams: GIGParamsInBody = {
            dateFrom: '2025/01/01',  // Wrong format
            dateTo: '2025/12/31'     // Wrong format
        };

        const response = await request.post('/corporateActions/search-with-pos', {
            data: gigParams,
            params: {
                page: 0,
                pageSize: 10
            }
        });
        
        expect(response.status()).toBe(400);
        const errorBody = await response.json();
        expect(errorBody).toHaveProperty('message');
    });

    test('T4_SearchWithPositions_InvalidEnumValues_Returns400', async ({ request }) => {
        const gigParams: GIGParamsInBody = {
            language: 'INVALID' as any,
            camv: ['INVALID'] as any,
            cantypCaevs: ['INVALID']
        };

        const response = await request.post('/corporateActions/search-with-pos', {
            data: gigParams,
            params: {
                page: 0,
                pageSize: 10
            }
        });
        
        expect(response.status()).toBe(400);
        const errorBody = await response.json();
        expect(errorBody).toHaveProperty('message');
    });

    test('T4_SearchWithPositions_InvalidPaginationParams_Returns400', async ({ request }) => {
        const response = await request.post('/corporateActions/search-with-pos', {
            data: {},
            params: {
                page: -1,          // Invalid page
                pageSize: 0,       // Invalid page size
                sort: '',          // Empty sort field
                order: 'INVALID'   // Invalid order
            }
        });
        
        expect(response.status()).toBe(400);
        const errorBody = await response.json();
        expect(errorBody).toHaveProperty('message');
    });

    test('T4_GetHistory_InvalidSpaId_Returns404', async ({ request }) => {
        const response = await request.get(`/corporateActions/history/${testData.invalid.spaId}`);
        
        expect(response.status()).toBe(404);
        const errorBody = await response.json();
        expect(errorBody).toHaveProperty('message');
    });

    test('T4_GetCanpos_InvalidZspaId_Returns404', async ({ request }) => {
        const response = await request.get(`/corporateActions/canpos/${testData.invalid.zspaId}`);
        
        expect(response.status()).toBe(404);
        const errorBody = await response.json();
        expect(errorBody).toHaveProperty('message');
    });

    test('T4_WithdrawCorporateAction_InvalidReason_Returns400', async ({ request }) => {
        const response = await request.post('/corporateActionsManagement/corporateAction/forCorrection', {
            data: {
                zspaId: testData.valid.zspaId,
                reason: ''  // Empty reason
            }
        });
        
        expect(response.status()).toBe(400);
        const errorBody = await response.json();
        expect(errorBody).toHaveProperty('message');
    });
});
