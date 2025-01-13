import { test, expect } from '../fixtures/test-fixtures';
import { corporateActionsTestData as testData } from '../../test-data/corporate-actions.data';
import { WithdrawRequest, WithdrawResponse } from '../../test-data/interfaces/api-interfaces';

test.describe('Corporate Actions Management API', () => {
    test('T1_WithdrawCorporateAction_ValidData_ActionWithdrawn', async ({ request, apiHelpers }) => {
        const withdrawRequest: WithdrawRequest = {
            zspaId: testData.valid.zspaId,
            reason: testData.valid.withdrawalReason
        };

        const response = await request.post('/corporateActionsManagement/corporateAction/forCorrection', {
            data: withdrawRequest
        });
        
        await apiHelpers.validateSuccessResponse(response);
        const body = await response.json() as WithdrawResponse;
        expect(body.success).toBeTruthy();
        expect(body.zspaId).toBe(testData.valid.zspaId);
    });

    test('T4_WithdrawCorporateAction_NonexistentZspaId_Returns404', async ({ request }) => {
        const withdrawRequest: WithdrawRequest = {
            zspaId: testData.invalid.zspaId,
            reason: testData.valid.withdrawalReason
        };

        const response = await request.post('/corporateActionsManagement/corporateAction/forCorrection', {
            data: withdrawRequest
        });
        
        expect(response.status()).toBe(404);
        const errorBody = await response.json();
        expect(errorBody).toHaveProperty('message');
    });

    test('T4_WithdrawCorporateAction_EmptyReason_Returns400', async ({ request }) => {
        const withdrawRequest: WithdrawRequest = {
            zspaId: testData.valid.zspaId,
            reason: ''  // Empty reason
        };

        const response = await request.post('/corporateActionsManagement/corporateAction/forCorrection', {
            data: withdrawRequest
        });
        
        expect(response.status()).toBe(400);
        const errorBody = await response.json();
        expect(errorBody).toHaveProperty('message');
    });

    test('T4_WithdrawCorporateAction_InvalidZspaIdFormat_Returns400', async ({ request }) => {
        const withdrawRequest: WithdrawRequest = {
            zspaId: testData.invalid.invalidFormat.zspaId,
            reason: testData.valid.withdrawalReason
        };

        const response = await request.post('/corporateActionsManagement/corporateAction/forCorrection', {
            data: withdrawRequest
        });
        
        expect(response.status()).toBe(400);
        const errorBody = await response.json();
        expect(errorBody).toHaveProperty('message');
    });

    test('T4_WithdrawCorporateAction_MissingRequiredFields_Returns400', async ({ request }) => {
        const response = await request.post('/corporateActionsManagement/corporateAction/forCorrection', {
            data: {}  // Missing all required fields
        });
        
        expect(response.status()).toBe(400);
        const errorBody = await response.json();
        expect(errorBody).toHaveProperty('message');
    });

    test('T1_WithdrawCorporateAction_ValidateResponseStructure', async ({ request, apiHelpers }) => {
        const withdrawRequest: WithdrawRequest = {
            zspaId: testData.valid.zspaId,
            reason: testData.valid.withdrawalReason
        };

        const response = await request.post('/corporateActionsManagement/corporateAction/forCorrection', {
            data: withdrawRequest
        });
        
        await apiHelpers.validateSuccessResponse(response);
        const body = await response.json() as WithdrawResponse;
        
        // Validate response structure
        expect(body).toHaveProperty('success');
        expect(body).toHaveProperty('zspaId');
        expect(body).toHaveProperty('timestamp');
        
        // Type validations
        expect(typeof body.success).toBe('boolean');
        expect(typeof body.zspaId).toBe('string');
        expect(new Date(body.timestamp).toString()).not.toBe('Invalid Date');
        
        // Optional fields
        if (body.message) {
            expect(typeof body.message).toBe('string');
        }
    });
});
