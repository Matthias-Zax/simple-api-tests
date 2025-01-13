import { test as base } from '@playwright/test';
import { ApiHelpers } from '../helpers/api-helpers';
import { TestDataValidator } from '../../test-data/validation';

// Extend the basic test fixture
export const test = base.extend({
    // Add API helpers to the fixture
    apiHelpers: async ({}, use) => {
        await use(ApiHelpers);
    },
    
    // Add data validator to the fixture
    validator: async ({}, use) => {
        await use(TestDataValidator);
    }
});

export { expect } from '@playwright/test';
