import { test, expect } from '../../fixtures/test-fixtures';
import { corporateActionsTestData as testData } from '../../../test-data/corporate-actions.data';
import { 
    GIGParamsInBody, 
    SearchCanInstanceResultWithPos, 
    SearchResponse, 
    PaginationParams,
    SearchParams,
    CanTypeId,
    SpaCanstat,
    YesNoStatus
} from '../../../test-data/interfaces/api-interfaces';

test.describe('Corporate Actions Search API', () => {
    test('T1_SearchCorporateActions_ValidFilters_ReturnsFilteredList @smoke', async ({ request, apiHelpers, validator }) => {
        // Validate test data
        expect(validator.isValidIsin(testData.valid.isin)).toBeTruthy();
        expect(validator.isValidCanTypeId(testData.valid.canTypeId)).toBeTruthy();

        // Prepare search parameters
        const searchParams: SearchParams = {
            isin: testData.valid.isin,
            canTypeId: testData.valid.canTypeId as CanTypeId,
            spaCanstat: testData.valid.spaCanstat as SpaCanstat,
            page: testData.defaults.page,
            pageSize: testData.defaults.pageSize,
            sort: testData.defaults.sort,
            order: testData.defaults.order
        };

        // Convert to request params with defaults for optional fields
        const requestParams: { [key: string]: string | number } = {};
        
        if (searchParams.isin) {
            requestParams.isin = searchParams.isin;
        }
        if (searchParams.canTypeId) {
            requestParams.canTypeId = searchParams.canTypeId;
        }
        if (searchParams.spaCanstat) {
            requestParams.spaCanstat = searchParams.spaCanstat;
        }
        
        requestParams.page = searchParams.page ?? 0;
        requestParams.pageSize = searchParams.pageSize ?? 10;
        requestParams.sort = searchParams.sort ?? '';
        requestParams.order = searchParams.order ?? 'desc';

        const response = await request.get('/corporateActions/search', {
            params: requestParams
        });
        
        await apiHelpers.validateSuccessResponse(response);
        const body = await response.json() as SearchResponse<SearchCanInstanceResultWithPos>;
        
        expect(body.content).toBeDefined();
        expect(Array.isArray(body.content)).toBeTruthy();
        
        if (body.content.length > 0) {
            body.content.forEach(item => {
                if (searchParams.isin) {
                    expect(item.isinIdent).toBe(searchParams.isin);
                }
                if (searchParams.canTypeId) {
                    expect(item.caev).toBe(searchParams.canTypeId);
                }
                if (searchParams.spaCanstat) {
                    expect(item.spaCanstat).toBe(searchParams.spaCanstat);
                }
            });
        }
    });

    test('T2_SearchCorporateActions_Pagination_ReturnsPagedResults', async ({ request, apiHelpers }) => {
        const paginationParams: PaginationParams = {
            page: testData.defaults.page,
            pageSize: testData.defaults.pageSize,
            sort: testData.defaults.sort,
            order: testData.defaults.order
        };

        // Convert to request params with defaults for optional fields
        const requestParams: { [key: string]: string | number } = {
            page: paginationParams.page ?? 0,
            pageSize: paginationParams.pageSize ?? 10
        };

        if (paginationParams.sort) {
            requestParams.sort = paginationParams.sort;
        }
        if (paginationParams.order) {
            requestParams.order = paginationParams.order;
        }

        const response = await request.get('/corporateActions/search', {
            params: requestParams
        });
        
        await apiHelpers.validateSuccessResponse(response);
        const body = await response.json() as SearchResponse<SearchCanInstanceResultWithPos>;
        
        expect(body.content).toBeDefined();
        expect(Array.isArray(body.content)).toBeTruthy();
    });

    test.describe('Corporate Actions Search API - GIG Endpoints', () => {
        test('T1_SearchWithPositions_ValidGIGParams_ReturnsPositionsList @smoke', async ({ request, apiHelpers, validator }) => {
            // Validate test data
            expect(validator.isValidIsin(testData.valid.gig.isin)).toBeTruthy();
            expect(validator.isValidCanTypeId(testData.valid.gig.cantypCaevs?.[0])).toBeTruthy();

            const gigParams: GIGParamsInBody = {
                dateFrom: testData.valid.gig.dateFrom,
                dateTo: testData.valid.gig.dateTo,
                accountNumbers: testData.valid.gig.accountNumbers,
                cantypCaevs: testData.valid.gig.cantypCaevs,
                functionOfMessage: testData.valid.gig.functionOfMessage,
                camv: testData.valid.gig.camv,
                language: testData.valid.gig.language,
                isin: testData.valid.gig.isin
            };

            // Convert arrays to comma-separated strings for query params
            const requestParams: Record<string, string | number> = {};

            if (gigParams.dateFrom) {
                requestParams.dateFrom = gigParams.dateFrom;
            }
            if (gigParams.dateTo) {
                requestParams.dateTo = gigParams.dateTo;
            }
            if (gigParams.accountNumbers?.length) {
                requestParams.accountNumbers = gigParams.accountNumbers.join(',');
            }
            if (gigParams.cantypCaevs?.length) {
                requestParams.cantypCaevs = gigParams.cantypCaevs.join(',');
            }
            if (gigParams.functionOfMessage?.length) {
                requestParams.functionOfMessage = gigParams.functionOfMessage.join(',');
            }
            if (gigParams.camv?.length) {
                requestParams.camv = gigParams.camv.join(',');
            }
            if (gigParams.language) {
                requestParams.language = gigParams.language;
            }
            if (gigParams.isin) {
                requestParams.isin = gigParams.isin;
            }

            const response = await request.get('/corporateActions/search/gig', {
                params: requestParams
            });
            
            await apiHelpers.validateSuccessResponse(response);
            const body = await response.json() as SearchResponse<SearchCanInstanceResultWithPos>;
            
            // Validate response structure
            expect(body.content).toBeDefined();
            expect(Array.isArray(body.content)).toBeTruthy();
            
            // Validate first item in content if exists
            if (body.content.length > 0) {
                const firstItem = body.content[0];
                expect(firstItem).toBeDefined();
                expect(firstItem.zspaId).toBeDefined();
                expect(firstItem.spaId).toBeDefined();
                
                if (firstItem.zspaInstructableViaGIG !== undefined) {
                    const validValues: YesNoStatus[] = ['Y', 'N'];
                    expect(validValues).toContain(firstItem.zspaInstructableViaGIG);
                }
            }
        });

        test('T1_SearchWithPositions_FilterByCAEV_ReturnsFilteredList', async ({ request, apiHelpers }) => {
            const gigParams: GIGParamsInBody = {
                cantypCaevs: ['TEND'],
                language: 'EN'
            };

            const response = await request.post('/corporateActions/search-with-pos', {
                data: gigParams,
                params: {
                    page: 0,
                    pageSize: 10
                }
            });
            
            await apiHelpers.validateSuccessResponse(response);
            const body = await response.json() as SearchResponse<SearchCanInstanceResultWithPos>;
            expect(body.content.every(item => item.caev === 'TEND')).toBeTruthy();
        });

        test('T1_SearchWithPositions_FilterByDateRange_ReturnsFilteredList', async ({ request, apiHelpers }) => {
            const gigParams: GIGParamsInBody = {
                dateFrom: testData.valid.gig.dateFrom,
                dateTo: testData.valid.gig.dateTo
            };

            const response = await request.post('/corporateActions/search-with-pos', {
                data: gigParams,
                params: {
                    page: 0,
                    pageSize: 10
                }
            });
            
            await apiHelpers.validateSuccessResponse(response);
            const body = await response.json() as SearchResponse<SearchCanInstanceResultWithPos>;
            
            // Verify dates are within range
            const isDateInRange = (dateStr: string): boolean => {
                const date = new Date(dateStr);
                const from = new Date(testData.valid.gig.dateFrom);
                const to = new Date(testData.valid.gig.dateTo);
                return date >= from && date <= to;
            };

            expect(body.content.every(item => !item.spaDatum || isDateInRange(item.spaDatum))).toBeTruthy();
        });

        test('T1_SearchWithPositions_FilterByAccountNumbers_ReturnsFilteredList', async ({ request, apiHelpers }) => {
            const gigParams: GIGParamsInBody = {
                accountNumbers: [testData.valid.gig.accountNumbers?.[0]]
            };

            // Convert arrays to comma-separated strings for query params
            const requestParams: Record<string, string | number> = {};
            
            if (gigParams.accountNumbers?.length) {
                requestParams.accountNumbers = gigParams.accountNumbers.join(',');
            }

            const response = await request.get('/corporateActions/search/gig', {
                params: requestParams
            });
            
            await apiHelpers.validateSuccessResponse(response);
            const body = await response.json() as SearchResponse<SearchCanInstanceResultWithPos>;
            expect(body.content.length).toBeGreaterThanOrEqual(0);
            
            // Verify account numbers in positions
            if (body.content.length > 0) {
                const firstItem = body.content[0];
                expect(firstItem.posNummer).toBeDefined();
                if (gigParams.accountNumbers?.length) {
                    expect(gigParams.accountNumbers).toContain(firstItem.posNummer);
                }
            }
        });

        test('T1_SearchWithPositions_FilterByMessageFunction_ReturnsFilteredList', async ({ request, apiHelpers }) => {
            const gigParams: GIGParamsInBody = {
                functionOfMessage: ['NEWM']
            };

            const response = await request.post('/corporateActions/search-with-pos', {
                data: gigParams,
                params: {
                    page: 0,
                    pageSize: 10
                }
            });
            
            await apiHelpers.validateSuccessResponse(response);
            const body = await response.json() as SearchResponse<SearchCanInstanceResultWithPos>;
            expect(body.content.every(item => item.functionOfMessage === 'NEWM')).toBeTruthy();
        });

        test('T1_SearchWithPositions_MultipleMessageFunctions_ReturnsFilteredList', async ({ request, apiHelpers }) => {
            const gigParams: GIGParamsInBody = {
                functionOfMessage: testData.valid.gig.functionOfMessage
            };

            const response = await request.post('/corporateActions/search-with-pos', {
                data: gigParams,
                params: {
                    page: 0,
                    pageSize: 10
                }
            });
            
            await apiHelpers.validateSuccessResponse(response);
            const body = await response.json() as SearchResponse<SearchCanInstanceResultWithPos>;
            expect(body.content.every(item => 
                item.functionOfMessage && testData.valid.gig.functionOfMessage.includes(item.functionOfMessage)
            )).toBeTruthy();
        });

        test('T1_SearchWithPositions_MultipleCAMV_ReturnsFilteredList', async ({ request, apiHelpers }) => {
            const gigParams: GIGParamsInBody = {
                camv: testData.valid.gig.camv
            };

            const response = await request.post('/corporateActions/search-with-pos', {
                data: gigParams,
                params: {
                    page: 0,
                    pageSize: 10
                }
            });
            
            await apiHelpers.validateSuccessResponse(response);
            const body = await response.json() as SearchResponse<SearchCanInstanceResultWithPos>;
            expect(body.content.every(item => 
                item.camv && testData.valid.gig.camv.includes(item.camv)
            )).toBeTruthy();
        });

        test('T1_SearchWithPositions_MaxPageSize_ReturnsLimitedResults', async ({ request, apiHelpers }) => {
            const maxPageSize = 100;
            const response = await request.post('/corporateActions/search-with-pos', {
                data: {},
                params: {
                    page: 0,
                    pageSize: maxPageSize + 1  // Try to exceed max page size
                }
            });
            
            await apiHelpers.validateSuccessResponse(response);
            const body = await response.json() as SearchResponse<SearchCanInstanceResultWithPos>;
            expect(body.content.length).toBeLessThanOrEqual(maxPageSize);
        });

        test('T1_SearchWithPositions_EmptyParams_ReturnsAllPositions', async ({ request, apiHelpers }) => {
            const response = await request.post('/corporateActions/search-with-pos', {
                data: {},
                params: {
                    page: testData.defaults.page,
                    pageSize: testData.defaults.pageSize
                }
            });
            
            await apiHelpers.validateSuccessResponse(response);
            const body = await response.json() as SearchResponse<SearchCanInstanceResultWithPos>;
            expect(body.content).toBeDefined();
            expect(Array.isArray(body.content)).toBeTruthy();
        });

        test('T2_SearchWithPositions_InvalidGIGParams_ReturnsError', async ({ request, apiHelpers }) => {
            const invalidParams: GIGParamsInBody = {
                dateFrom: testData.invalid.gig.dateFrom,
                dateTo: testData.invalid.gig.dateTo,
                accountNumbers: testData.invalid.gig.accountNumbers,
                cantypCaevs: testData.invalid.gig.cantypCaevs,
                functionOfMessage: testData.invalid.gig.functionOfMessage,
                camv: testData.invalid.gig.camv,
                language: testData.invalid.gig.language,
                isin: testData.invalid.gig.isin
            };

            // Convert arrays to comma-separated strings for query params
            const requestParams: Record<string, string | number> = {};

            if (invalidParams.dateFrom) {
                requestParams.dateFrom = invalidParams.dateFrom;
            }
            if (invalidParams.dateTo) {
                requestParams.dateTo = invalidParams.dateTo;
            }
            if (invalidParams.accountNumbers?.length) {
                requestParams.accountNumbers = invalidParams.accountNumbers.join(',');
            }
            if (invalidParams.cantypCaevs?.length) {
                requestParams.cantypCaevs = invalidParams.cantypCaevs.join(',');
            }
            if (invalidParams.functionOfMessage?.length) {
                requestParams.functionOfMessage = invalidParams.functionOfMessage.join(',');
            }
            if (invalidParams.camv?.length) {
                requestParams.camv = invalidParams.camv.join(',');
            }
            if (invalidParams.language) {
                requestParams.language = invalidParams.language;
            }
            if (invalidParams.isin) {
                requestParams.isin = invalidParams.isin;
            }

            const response = await request.get('/corporateActions/search/gig', {
                params: requestParams
            });

            await apiHelpers.validateErrorResponse(response);
        });
    });
});
