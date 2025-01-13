import { test, expect } from '@playwright/test';
import { corporateActionsTestData as testData } from '../test-data/corporate-actions.data';

test.describe('Corporate Actions API Tests', () => {
  test.describe('Search and Filter Operations', () => {
    test('should search corporate actions with various filters', async ({ request }) => {
      const response = await request.get('/corporateActions/canspa', {
        params: {
          isin: testData.valid.isin,
          canTypeId: testData.valid.canTypeId,
          page: testData.defaults.page,
          pageSize: testData.defaults.pageSize,
          sort: testData.defaults.sort,
          order: testData.defaults.order
        }
      });
      
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty('content');
      expect(Array.isArray(body.content)).toBeTruthy();
    });

    test('should search corporate actions with positions', async ({ request }) => {
      const response = await request.post('/corporateActions/search-with-pos', {
        data: {
          isin: testData.valid.isin,
          page: testData.defaults.page,
          pageSize: testData.defaults.pageSize
        }
      });
      
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    });
  });

  test.describe('Corporate Action Details', () => {
    test('should get corporate action details', async ({ request }) => {
      const response = await request.get('/corporateActionsData/details', {
        params: {
          zspaId: testData.valid.zspaId
        }
      });
      
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    });

    test('should get corporate action reference data', async ({ request }) => {
      const response = await request.get(`/corporateActionsData/corpRef/${testData.valid.zspaId}`);
      
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    });
  });

  test.describe('History and Tracking', () => {
    test('should get corporate action history', async ({ request }) => {
      const response = await request.get(`/corporateActions/history/${testData.valid.spaId}`);
      
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(Array.isArray(body)).toBeTruthy();
    });

    test('should get corporate action positions', async ({ request }) => {
      const response = await request.get(`/corporateActions/canpos/${testData.valid.zspaId}`);
      
      expect(response.ok()).toBeTruthy();
      expect(response.status()).toBe(200);
    });
  });

  test.describe('Error Scenarios', () => {
    test('should handle invalid ISIN format', async ({ request }) => {
      const response = await request.get('/corporateActions/canspa', {
        params: {
          isin: testData.invalid.isin,
          page: testData.defaults.page,
          pageSize: testData.defaults.pageSize
        }
      });
      
      expect(response.status()).toBe(400);
    });

    test('should handle non-existent corporate action', async ({ request }) => {
      const response = await request.get(`/corporateActionsData/corpRef/${testData.invalid.zspaId}`);
      
      expect(response.status()).toBe(404);
    });
  });
});
