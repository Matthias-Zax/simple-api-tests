import { test, expect } from '../fixtures/test-fixtures';
import { corporateActionsTestData as testData } from '../../test-data/corporate-actions.data';
import { WithdrawRequest, WithdrawResponse } from '../../test-data/interfaces/api-interfaces';

test.describe('Corporate Actions Management API', () => {
    test('T1_WithdrawCorporateAction_ValidData_ActionWithdrawn @smoke', async ({ request, apiHelpers }) => {
        const withdrawRequest: WithdrawRequest = {
            zspaId: testData.valid.zspaId,
            reason: testData.valid.withdrawalReason,
            comment: testData.valid.withdrawalComment,
            metadata: {
                requestId: `REQ-${Date.now()}`,
                source: 'API-TEST'
            }
        };

        const response = await request.post('/corporateActionsManagement/withdraw', {
            data: withdrawRequest
        });
        
        await apiHelpers.validateSuccessResponse(response);
        const body = await response.json() as WithdrawResponse;
        
        // Validate response
        expect(body.success).toBeTruthy();
        expect(body.zspaId).toBe(testData.valid.zspaId);
        expect(body.timestamp).toBeTruthy();
        expect(new Date(body.timestamp).toString()).not.toBe('Invalid Date');
        expect(body.status).toBe('WITHDRAWN');
    });

    test('T4_WithdrawCorporateAction_NonexistentZspaId_Returns404', async ({ request }) => {
        const withdrawRequest: WithdrawRequest = {
            zspaId: testData.invalid.zspaId,
            reason: testData.valid.withdrawalReason
        };

        const response = await request.post('/corporateActionsManagement/withdraw', {
            data: withdrawRequest
        });
        
        expect(response.status()).toBe(404);
        const errorBody = await response.json();
        expect(errorBody.message).toContain('not found');
        expect(errorBody.code).toBe('RESOURCE_NOT_FOUND');
    });

    test('T4_WithdrawCorporateAction_EmptyReason_Returns400', async ({ request }) => {
        const withdrawRequest: WithdrawRequest = {
            zspaId: testData.valid.zspaId,
            reason: ''
        };

        const response = await request.post('/corporateActionsManagement/withdraw', {
            data: withdrawRequest
        });
        
        expect(response.status()).toBe(400);
        const errorBody = await response.json();
        expect(errorBody.message).toContain('reason');
        expect(errorBody.code).toBe('INVALID_REQUEST');
    });

    test('T4_WithdrawCorporateAction_InvalidZspaIdFormat_Returns400', async ({ request }) => {
        const withdrawRequest: WithdrawRequest = {
            zspaId: testData.invalid.invalidFormat.zspaId,
            reason: testData.valid.withdrawalReason
        };

        const response = await request.post('/corporateActionsManagement/withdraw', {
            data: withdrawRequest
        });
        
        expect(response.status()).toBe(400);
        const errorBody = await response.json();
        expect(errorBody.message).toContain('zspaId');
        expect(errorBody.code).toBe('INVALID_FORMAT');
    });

    test('T4_WithdrawCorporateAction_MissingRequiredFields_Returns400', async ({ request }) => {
        const response = await request.post('/corporateActionsManagement/withdraw', {
            data: {}
        });
        
        expect(response.status()).toBe(400);
        const errorBody = await response.json();
        expect(errorBody.message).toContain('required');
        expect(errorBody.code).toBe('MISSING_REQUIRED_FIELDS');
    });

    test('T1_WithdrawCorporateAction_ValidateResponseStructure @smoke', async ({ request, apiHelpers }) => {
        const withdrawRequest: WithdrawRequest = {
            zspaId: testData.valid.zspaId,
            reason: testData.valid.withdrawalReason,
            metadata: {
                requestId: `REQ-${Date.now()}`
            }
        };

        const response = await request.post('/corporateActionsManagement/withdraw', {
            data: withdrawRequest
        });
        
        await apiHelpers.validateSuccessResponse(response);
        const body = await response.json() as WithdrawResponse;
        
        // Required fields
        expect(body.success).toBeDefined();
        expect(body.zspaId).toBeDefined();
        expect(body.timestamp).toBeDefined();
        
        // Type validations
        expect(typeof body.success).toBe('boolean');
        expect(typeof body.zspaId).toBe('string');
        expect(new Date(body.timestamp).toString()).not.toBe('Invalid Date');
        
        // Optional fields
        if (body.message) {
            expect(typeof body.message).toBe('string');
        }
        if (body.status) {
            expect(['WITHDRAWN', 'PENDING', 'FAILED']).toContain(body.status);
        }
        if (body.requestId) {
            expect(typeof body.requestId).toBe('string');
        }
    });
});
