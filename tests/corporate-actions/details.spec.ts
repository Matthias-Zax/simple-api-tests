import { test, expect } from '../fixtures/test-fixtures';
import { corporateActionsTestData as testData } from '../../test-data/corporate-actions.data';
import { CorpActionDetails, CorpActionReference, CanPosResponse } from '../../test-data/interfaces/api-interfaces';

test.describe('Corporate Actions Details API', () => {
    test('T1_GetCorporateActionDetails_ValidZspaId_ReturnsDetails', async ({ request, apiHelpers }) => {
        const response = await request.get('/corporateActionsData/details', {
            params: {
                zspaId: testData.valid.zspaId
            }
        });
        
        await apiHelpers.validateSuccessResponse(response);
        const body = await response.json() as CorpActionDetails;
        
        // Validate required fields
        expect(body.zspaId).toBe(testData.valid.zspaId);
        expect(body.isinIdent).toBeTruthy();
        expect(body.spaDatum).toBeTruthy();
        
        // Validate optional fields if present
        if (body.zspaInstructableViaGIG) {
            expect(['Y', 'N']).toContain(body.zspaInstructableViaGIG);
        }
        if (body.language) {
            expect(['DE', 'EN']).toContain(body.language);
        }
    });

    test('T1_GetCorpRef_ValidZspaId_ReturnsReferenceData', async ({ request, apiHelpers }) => {
        const response = await request.get(`/corporateActionsData/corpRef/${testData.valid.zspaId}`);
        
        await apiHelpers.validateSuccessResponse(response);
        const body = await response.json() as CorpActionReference;
        
        // Validate reference data fields
        expect(body.zspaId).toBe(testData.valid.zspaId);
        if (body.caev) {
            expect(testData.valid.gig.cantypCaevs).toContain(body.caev);
        }
        if (body.camv) {
            expect(['CHOS', 'VOLU', 'MAND']).toContain(body.camv);
        }
    });

    test('T1_GetCanpos_ValidZspaId_ReturnsPositions', async ({ request, apiHelpers }) => {
        const response = await request.get(`/corporateActions/canpos/${testData.valid.zspaId}`);
        
        await apiHelpers.validateSuccessResponse(response);
        const body = await response.json() as CanPosResponse;
        
        // Validate positions data
        expect(Array.isArray(body.positions)).toBeTruthy();
        if (body.positions.length > 0) {
            const position = body.positions[0];
            expect(position).toHaveProperty('accountNumber');
            expect(position).toHaveProperty('posMenge');
            if (position.posMenge !== undefined) {
                expect(typeof position.posMenge).toBe('number');
            }
        }
    });

    test('T4_GetDetails_NonexistentZspaId_Returns404', async ({ request }) => {
        const response = await request.get('/corporateActionsData/details', {
            params: {
                zspaId: testData.invalid.zspaId
            }
        });
        
        expect(response.status()).toBe(404);
    });

    test('T4_GetDetails_InvalidZspaIdFormat_Returns400', async ({ request }) => {
        const response = await request.get('/corporateActionsData/details', {
            params: {
                zspaId: testData.invalid.invalidFormat.zspaId
            }
        });
        
        expect(response.status()).toBe(400);
    });

    test('T1_GetDetails_ValidateAllResponseFields', async ({ request, apiHelpers }) => {
        const response = await request.get('/corporateActionsData/details', {
            params: {
                zspaId: testData.valid.zspaId
            }
        });
        
        await apiHelpers.validateSuccessResponse(response);
        const body = await response.json() as CorpActionDetails;
        
        // Required fields
        expect(body.zspaId).toBeTruthy();
        expect(body.spaId).toBeTruthy();
        expect(body.isinIdent).toBeTruthy();
        expect(body.spaDatum).toBeTruthy();
        
        // Optional fields with type validation
        if (body.posMenge !== undefined) {
            expect(typeof body.posMenge).toBe('number');
        }
        if (body.zspaInstructableViaGIG) {
            expect(['Y', 'N']).toContain(body.zspaInstructableViaGIG);
        }
        if (body.lastReleaseDate) {
            expect(new Date(body.lastReleaseDate).toString()).not.toBe('Invalid Date');
        }
        if (body.language) {
            expect(['DE', 'EN']).toContain(body.language);
        }
        if (body.caev) {
            expect(testData.valid.gig.cantypCaevs).toContain(body.caev);
        }
        if (body.camv) {
            expect(['CHOS', 'VOLU', 'MAND']).toContain(body.camv);
        }
    });
});
