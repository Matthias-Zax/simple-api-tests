import { test, expect } from '../fixtures/test-fixtures';
import { corporateActionsTestData as testData } from '../../test-data/corporate-actions.data';
import { HistoryEntry } from '../../test-data/interfaces/api-interfaces';

test.describe('Corporate Actions History API', () => {
    test('T1_GetHistory_ValidSpaId_ReturnsHistoryList', async ({ request, apiHelpers }) => {
        const response = await request.get(`/corporateActions/history/${testData.valid.spaId}`);
        
        await apiHelpers.validateSuccessResponse(response);
        const body = await response.json() as HistoryEntry[];
        expect(Array.isArray(body)).toBeTruthy();

        if (body.length > 0) {
            const entry = body[0];
            expect(entry).toHaveProperty('spaId');
            expect(entry).toHaveProperty('timestamp');
            expect(entry).toHaveProperty('action');
            
            // Validate timestamp format
            expect(new Date(entry.timestamp).toString()).not.toBe('Invalid Date');
        }
    });

    test('T1_GetHistory_ValidateActionTypes', async ({ request, apiHelpers }) => {
        const response = await request.get(`/corporateActions/history/${testData.valid.spaId}`);
        
        await apiHelpers.validateSuccessResponse(response);
        const body = await response.json() as HistoryEntry[];
        
        // Verify all actions are valid
        const validActions = ['CREATE', 'UPDATE', 'DELETE', 'WITHDRAW'];
        body.forEach(entry => {
            expect(validActions).toContain(entry.action);
        });
    });

    test('T1_GetHistory_ValidateSorting', async ({ request, apiHelpers }) => {
        const response = await request.get(`/corporateActions/history/${testData.valid.spaId}`);
        
        await apiHelpers.validateSuccessResponse(response);
        const body = await response.json() as HistoryEntry[];
        
        // Verify descending order by timestamp
        const timestamps = body.map(entry => new Date(entry.timestamp).getTime());
        const isSorted = timestamps.every((timestamp, index) => 
            index === 0 || timestamp <= timestamps[index - 1]
        );
        expect(isSorted).toBeTruthy();
    });

    test('T4_GetHistory_NonexistentSpaId_Returns404', async ({ request }) => {
        const response = await request.get(`/corporateActions/history/${testData.invalid.spaId}`);
        
        expect(response.status()).toBe(404);
        const errorBody = await response.json();
        expect(errorBody).toHaveProperty('message');
    });

    test('T4_GetHistory_InvalidSpaIdFormat_Returns400', async ({ request }) => {
        const response = await request.get(`/corporateActions/history/${testData.invalid.invalidFormat.spaId}`);
        
        expect(response.status()).toBe(400);
        const errorBody = await response.json();
        expect(errorBody).toHaveProperty('message');
    });

    test('T1_GetHistory_ValidateAllResponseFields', async ({ request, apiHelpers }) => {
        const response = await request.get(`/corporateActions/history/${testData.valid.spaId}`);
        
        await apiHelpers.validateSuccessResponse(response);
        const body = await response.json() as HistoryEntry[];
        
        if (body.length > 0) {
            body.forEach(entry => {
                // Required fields
                expect(entry.spaId).toBe(testData.valid.spaId);
                expect(entry.timestamp).toBeTruthy();
                expect(entry.action).toBeTruthy();
                
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
                expect(['CREATE', 'UPDATE', 'DELETE', 'WITHDRAW']).toContain(entry.action);
            });
        }
    });
});
