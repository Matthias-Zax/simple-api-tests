import { test, expect } from '../fixtures/test-fixtures';
import { corporateActionsTestData as testData } from '../../test-data/corporate-actions.data';
import { GIGParamsInBody, SearchCanInstanceResultWithPos, SearchResponse, PaginationParams } from '../../test-data/interfaces/api-interfaces';

test.describe('Corporate Actions Search API', () => {
    test('T1_SearchCorporateActions_ValidFilters_ReturnsFilteredList', async ({ request, apiHelpers, validator }) => {
        // Validate test data
        expect(validator.isValidIsin(testData.valid.isin)).toBeTruthy();
        expect(validator.isValidCanTypeId(testData.valid.canTypeId)).toBeTruthy();

        const params = {
            ...apiHelpers.getDefaultSearchParams(),
            isin: testData.valid.isin,
            canTypeId: testData.valid.canTypeId,
            spaCanstat: testData.valid.spaCanstat,
            spaStatus: testData.valid.spaStatus,
        };

        const response = await apiHelpers.searchCorporateActions(request, params);
        await apiHelpers.validateSuccessResponse(response);
        
        const body = await response.json();
        expect(body).toHaveProperty('content');
        expect(Array.isArray(body.content)).toBeTruthy();
    });

    test.describe('Corporate Actions Search API - GIG Endpoints', () => {
        test('T1_SearchWithPositions_ValidGIGParams_ReturnsPositionsList', async ({ request, apiHelpers, validator }) => {
            // Validate test data
            expect(validator.isValidIsin(testData.valid.gig.isin)).toBeTruthy();
            expect(validator.isValidPagination(testData.defaults.page, testData.defaults.pageSize)).toBeTruthy();

            const gigParams: GIGParamsInBody = {
                ...testData.valid.gig
            };

            const paginationParams: PaginationParams = {
                page: testData.defaults.page,
                pageSize: testData.defaults.pageSize,
                sort: testData.defaults.sort,
                order: testData.defaults.order
            };

            const response = await request.post('/corporateActions/search-with-pos', {
                data: gigParams,
                params: paginationParams
            });
            
            await apiHelpers.validateSuccessResponse(response);
            const body = await response.json() as SearchResponse<SearchCanInstanceResultWithPos>;
            
            // Validate response structure
            expect(body).toHaveProperty('content');
            expect(Array.isArray(body.content)).toBeTruthy();
            
            // Validate first item in content if exists
            if (body.content.length > 0) {
                const firstItem = body.content[0];
                expect(firstItem).toHaveProperty('isinIdent');
                expect(firstItem).toHaveProperty('spaDatum');
                expect(firstItem).toHaveProperty('posMenge');
                if (firstItem.zspaInstructableViaGIG) {
                    expect(['Y', 'N']).toContain(firstItem.zspaInstructableViaGIG);
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
                dateFrom: '2025-01-01',
                dateTo: '2025-12-31'
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
            const isDateInRange = (dateStr: string) => {
                const date = new Date(dateStr);
                const from = new Date('2025-01-01');
                const to = new Date('2025-12-31');
                return date >= from && date <= to;
            };

            expect(body.content.every(item => !item.spaDatum || isDateInRange(item.spaDatum))).toBeTruthy();
        });

        test('T1_SearchWithPositions_FilterByAccountNumbers_ReturnsFilteredList', async ({ request, apiHelpers }) => {
            const gigParams: GIGParamsInBody = {
                accountNumbers: ['60684420000']
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
            expect(body.content.length).toBeGreaterThanOrEqual(0);
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
                functionOfMessage: ['NEWM', 'REPL']
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
                ['NEWM', 'REPL'].includes(item.functionOfMessage || '')
            )).toBeTruthy();
        });

        test('T1_SearchWithPositions_SortBySpaDatum_ReturnsOrderedList', async ({ request, apiHelpers }) => {
            const response = await request.post('/corporateActions/search-with-pos', {
                data: {},
                params: {
                    page: 0,
                    pageSize: 10,
                    sort: 'spaDatum',
                    order: 'desc'
                }
            });
            
            await apiHelpers.validateSuccessResponse(response);
            const body = await response.json() as SearchResponse<SearchCanInstanceResultWithPos>;
            
            // Verify descending order
            const dates = body.content
                .map(item => item.spaDatum)
                .filter((date): date is string => !!date)
                .map(date => new Date(date).getTime());
            
            const isSorted = dates.every((date, index) => 
                index === 0 || date <= dates[index - 1]
            );
            expect(isSorted).toBeTruthy();
        });

        test('T1_SearchWithPositions_MultipleCAEV_ReturnsFilteredList', async ({ request, apiHelpers }) => {
            const gigParams: GIGParamsInBody = {
                cantypCaevs: ['TEND', 'DVCA']
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
                ['TEND', 'DVCA'].includes(item.caev || '')
            )).toBeTruthy();
        });

        test('T1_SearchWithPositions_MultipleCAMV_ReturnsFilteredList', async ({ request, apiHelpers }) => {
            const gigParams: GIGParamsInBody = {
                camv: ['CHOS', 'VOLU', 'MAND']
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
                ['CHOS', 'VOLU', 'MAND'].includes(item.camv || '')
            )).toBeTruthy();
        });

        test('T4_SearchWithPositions_DateFromAfterDateTo_Returns400', async ({ request }) => {
            const invalidGigParams: GIGParamsInBody = {
                dateFrom: '2025-12-31',
                dateTo: '2025-01-01'  // dateFrom is after dateTo
            };

            const response = await request.post('/corporateActions/search-with-pos', {
                data: invalidGigParams,
                params: {
                    page: 0,
                    pageSize: 10
                }
            });
            
            expect(response.status()).toBe(400);
            const errorBody = await response.json();
            expect(errorBody).toHaveProperty('message');
        });

        test('T4_SearchWithPositions_InvalidPageSize_Returns400', async ({ request }) => {
            const response = await request.post('/corporateActions/search-with-pos', {
                data: {},
                params: {
                    page: 0,
                    pageSize: -1  // invalid page size
                }
            });
            
            expect(response.status()).toBe(400);
        });

        test('T4_SearchWithPositions_InvalidSortField_Returns400', async ({ request }) => {
            const response = await request.post('/corporateActions/search-with-pos', {
                data: {},
                params: {
                    page: 0,
                    pageSize: 10,
                    sort: 'invalidField',  // invalid sort field
                    order: 'desc'
                }
            });
            
            expect(response.status()).toBe(400);
        });

        test('T1_SearchWithPositions_LastPage_ReturnsPartialList', async ({ request, apiHelpers }) => {
            // First get total count
            const firstResponse = await request.post('/corporateActions/search-with-pos', {
                data: {},
                params: {
                    page: 0,
                    pageSize: 10
                }
            });
            
            await apiHelpers.validateSuccessResponse(firstResponse);
            const firstBody = await firstResponse.json() as SearchResponse<SearchCanInstanceResultWithPos>;
            
            if (firstBody.totalPages && firstBody.totalPages > 1) {
                const lastPageResponse = await request.post('/corporateActions/search-with-pos', {
                    data: {},
                    params: {
                        page: firstBody.totalPages - 1,
                        pageSize: 10
                    }
                });
                
                await apiHelpers.validateSuccessResponse(lastPageResponse);
                const lastPageBody = await lastPageResponse.json() as SearchResponse<SearchCanInstanceResultWithPos>;
                expect(lastPageBody.content.length).toBeLessThanOrEqual(10);
                expect(lastPageBody.number).toBe(firstBody.totalPages - 1);
            }
        });

        test('T1_SearchWithPositions_EmptySearchResults_ReturnsEmptyList', async ({ request, apiHelpers }) => {
            const gigParams: GIGParamsInBody = {
                dateFrom: '2099-01-01',  // Future date that should have no results
                dateTo: '2099-12-31'
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
            expect(body.content).toHaveLength(0);
            expect(body.totalElements).toBe(0);
        });

        test('T1_SearchWithPositions_MaxPageSize_ReturnsLimitedResults', async ({ request, apiHelpers }) => {
            const response = await request.post('/corporateActions/search-with-pos', {
                data: {},
                params: {
                    page: 0,
                    pageSize: 100  // Try with max page size
                }
            });
            
            await apiHelpers.validateSuccessResponse(response);
            const body = await response.json() as SearchResponse<SearchCanInstanceResultWithPos>;
            expect(body.content.length).toBeLessThanOrEqual(100);
        });

        test('T1_SearchWithPositions_ValidateAllResponseFields', async ({ request, apiHelpers }) => {
            const response = await request.post('/corporateActions/search-with-pos', {
                data: testData.valid.gig,
                params: {
                    page: 0,
                    pageSize: 10
                }
            });
            
            await apiHelpers.validateSuccessResponse(response);
            const body = await response.json() as SearchResponse<SearchCanInstanceResultWithPos>;
            
            if (body.content.length > 0) {
                const item = body.content[0];
                
                // Required fields
                expect(item).toHaveProperty('zspaId');
                expect(item).toHaveProperty('spaId');
                expect(item).toHaveProperty('isinIdent');
                expect(item).toHaveProperty('spaDatum');
                
                // Optional fields with type validation
                if (item.posMenge !== undefined) {
                    expect(typeof item.posMenge).toBe('number');
                }
                if (item.zspaInstructableViaGIG) {
                    expect(['Y', 'N']).toContain(item.zspaInstructableViaGIG);
                }
                if (item.lastReleaseDate) {
                    expect(new Date(item.lastReleaseDate).toString()).not.toBe('Invalid Date');
                }
            }
        });

        test('T1_SearchWithPositions_FilterByCAMV_ReturnsFilteredList', async ({ request, apiHelpers }) => {
            const gigParams: GIGParamsInBody = {
                camv: ['CHOS']
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
            expect(body.content.every(item => item.camv === 'CHOS')).toBeTruthy();
        });

        test('T4_SearchWithPositions_InvalidDateRange_Returns400', async ({ request }) => {
            const invalidGigParams: GIGParamsInBody = {
                dateFrom: '2025-13-01',  // invalid month
                dateTo: '2025-12-32'     // invalid day
            };

            const response = await request.post('/corporateActions/search-with-pos', {
                data: invalidGigParams,
                params: {
                    page: 0,
                    pageSize: 10
                }
            });
            
            expect(response.status()).toBe(400);
            const errorBody = await response.json();
            expect(errorBody).toHaveProperty('message');
        });

        test('T4_SearchWithPositions_InvalidLanguage_Returns400', async ({ request }) => {
            const invalidGigParams: GIGParamsInBody = {
                language: 'FR' as any  // invalid language
            };

            const response = await request.post('/corporateActions/search-with-pos', {
                data: invalidGigParams,
                params: {
                    page: 0,
                    pageSize: 10
                }
            });
            
            expect(response.status()).toBe(400);
        });

        test('T4_SearchWithPositions_InvalidCAEV_Returns400', async ({ request }) => {
            const invalidGigParams: GIGParamsInBody = {
                cantypCaevs: ['INVALID_CAEV']
            };

            const response = await request.post('/corporateActions/search-with-pos', {
                data: invalidGigParams,
                params: {
                    page: 0,
                    pageSize: 10
                }
            });
            
            expect(response.status()).toBe(400);
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
            expect(body).toHaveProperty('content');
            expect(Array.isArray(body.content)).toBeTruthy();
        });

        test('T1_SearchWithPositions_OnlyPagination_ReturnsPagedResults', async ({ request, apiHelpers }) => {
            const customPageSize = 5;
            const response = await request.post('/corporateActions/search-with-pos', {
                data: {},
                params: {
                    page: 0,
                    pageSize: customPageSize,
                    sort: 'spaDatum',
                    order: 'desc'
                }
            });
            
            await apiHelpers.validateSuccessResponse(response);
            const body = await response.json() as SearchResponse<SearchCanInstanceResultWithPos>;
            expect(body).toHaveProperty('content');
            expect(Array.isArray(body.content)).toBeTruthy();
            expect(body.content.length).toBeLessThanOrEqual(customPageSize);
        });

        test('T1_SearchWithPositions_CombinedFilters_ReturnsFilteredList', async ({ request, apiHelpers }) => {
            const gigParams: GIGParamsInBody = {
                dateFrom: '2025-01-01',
                dateTo: '2025-12-31',
                cantypCaevs: ['TEND'],
                functionOfMessage: ['NEWM'],
                camv: ['CHOS'],
                language: 'EN'
            };

            const response = await request.post('/corporateActions/search-with-pos', {
                data: gigParams,
                params: {
                    page: 0,
                    pageSize: 10,
                    sort: 'spaDatum',
                    order: 'desc'
                }
            });
            
            await apiHelpers.validateSuccessResponse(response);
            const body = await response.json() as SearchResponse<SearchCanInstanceResultWithPos>;
            
            if (body.content.length > 0) {
                const item = body.content[0];
                expect(item.caev).toBe('TEND');
                expect(item.functionOfMessage).toBe('NEWM');
                expect(item.camv).toBe('CHOS');
                
                const itemDate = new Date(item.spaDatum!);
                expect(itemDate >= new Date('2025-01-01')).toBeTruthy();
                expect(itemDate <= new Date('2025-12-31')).toBeTruthy();
            }
        });
    });

    test('T4_SearchWithPositions_InvalidGIGParams_Returns400', async ({ request }) => {
        const invalidGigParams: GIGParamsInBody = {
            ...testData.invalid.gig
        };

        const paginationParams: PaginationParams = {
            page: testData.defaults.page,
            pageSize: testData.defaults.pageSize
        };

        const response = await request.post('/corporateActions/search-with-pos', {
            data: invalidGigParams,
            params: paginationParams
        });
        
        expect(response.status()).toBe(400);
        const errorBody = await response.json();
        expect(errorBody).toHaveProperty('message');
    });

    test('T1_SearchNsdTaxDisclosure_ValidIsin_ReturnsTaxDisclosureList', async ({ request, apiHelpers, validator }) => {
        // Validate test data
        expect(validator.isValidIsin(testData.valid.isin)).toBeTruthy();
        expect(validator.isValidPagination(testData.defaults.page, testData.defaults.pageSize)).toBeTruthy();

        const response = await request.get('/corporateActions/searchNsdTaxDisclosure', {
            params: {
                isin: testData.valid.isin,
                page: testData.defaults.page,
                pageSize: testData.defaults.pageSize
            }
        });
        
        await apiHelpers.validateSuccessResponse(response);
    });
});
