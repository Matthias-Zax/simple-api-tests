import { APIRequestContext, expect } from '@playwright/test';
import { corporateActionsTestData as testData } from '../../test-data/corporate-actions.data';

export class ApiHelpers {
    static async validateSuccessResponse(response: any) {
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
    }

    static async validateErrorResponse(response: any, expectedStatus: number) {
        expect(response.ok()).toBeFalsy();
        expect(response.status()).toBe(expectedStatus);
    }

    static async searchCorporateActions(request: APIRequestContext, params: any) {
        return await request.get('/corporateActions/canspa', { params });
    }

    static async getCorporateActionDetails(request: APIRequestContext, zspaId: string) {
        return await request.get('/corporateActionsData/details', {
            params: { zspaId }
        });
    }

    static async getCorpRef(request: APIRequestContext, zspaId: string) {
        return await request.get(`/corporateActionsData/corpRef/${zspaId}`);
    }

    static getDefaultSearchParams() {
        return {
            page: testData.defaults.page,
            pageSize: testData.defaults.pageSize,
            sort: testData.defaults.sort,
            order: testData.defaults.order
        };
    }
}
