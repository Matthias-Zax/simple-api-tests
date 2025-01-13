import { test, expect } from '../fixtures/test-fixtures';
import { corporateActionsTestData as testData } from '../../test-data/corporate-actions.data';
import { HistoryEntry } from '../../test-data/interfaces/api-interfaces';

test.describe('Corporate Actions History API', () => {
    test('T1_GetHistory_ValidZspaId_ReturnsHistory', async ({ request, apiHelpers }) => {
        const response = await request.get(`/corporateActions/history/${testData.valid.zspaId}`);
        
        await apiHelpers.validateSuccessResponse(response);
        const body = await response.json() as HistoryEntry[];
        
        if (body.length > 0) {
            body.forEach(entry => {
                // Required fields
                expect(entry.zspaId).toBe(testData.valid.zspaId);
                expect(entry.spaId).toBe(testData.valid.spaId);
                expect(entry.timestamp).toBeTruthy();
                expect(entry.actionType).toBeTruthy();
                
                // Optional fields with type validation
                if (entry.userId) {
                    expect(typeof entry.userId).toBe('string');
                }
                if (entry.details) {
                    expect(typeof entry.details).toBe('string');
                }
                
                // Validate date format
                expect(new Date(entry.timestamp).toString()).not.toBe('Invalid Date');
                
                // Validate action type
                expect(['CREATE', 'UPDATE', 'DELETE', 'RELEASE']).toContain(entry.actionType);
            });
        }
    });

    test('T4_GetHistory_NonexistentZspaId_Returns404', async ({ request }) => {
        const response = await request.get(`/corporateActions/history/${testData.invalid.zspaId}`);
        
        expect(response.status()).toBe(404);
    });

    test('T4_GetHistory_InvalidZspaIdFormat_Returns400', async ({ request }) => {
        const response = await request.get(`/corporateActions/history/${testData.invalid.invalidFormat.zspaId}`);
        
        expect(response.status()).toBe(400);
    });

    test('T1_GetHistory_ValidateActionTypes', async ({ request, apiHelpers }) => {
        const response = await request.get(`/corporateActions/history/${testData.valid.zspaId}`);
        
        await apiHelpers.validateSuccessResponse(response);
        const body = await response.json() as HistoryEntry[];
        
        if (body.length > 0) {
            body.forEach(entry => {
                expect(['CREATE', 'UPDATE', 'DELETE', 'RELEASE']).toContain(entry.actionType);
                
                if (entry.status) {
                    expect(['SUCCESS', 'FAILED', 'PENDING']).toContain(entry.status);
                }
            });
        }
    });

    test('T1_GetHistory_ValidateSorting', async ({ request, apiHelpers }) => {
        const response = await request.get(`/corporateActions/history/${testData.valid.zspaId}`, {
            params: {
                sort: 'timestamp',
                order: 'desc'
            }
        });
        
        await apiHelpers.validateSuccessResponse(response);
        const body = await response.json() as HistoryEntry[];
        
        if (body.length > 1) {
            // Verify descending order
            for (let i = 1; i < body.length; i++) {
                const prevTimestamp = new Date(body[i-1].timestamp).getTime();
                const currTimestamp = new Date(body[i].timestamp).getTime();
                expect(prevTimestamp).toBeGreaterThanOrEqual(currTimestamp);
            }
        }
    });
});
