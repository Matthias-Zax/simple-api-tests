import { test as base } from '@playwright/test';
import { DatabaseHelper } from '../helpers/db-helper';
import { corporateActionsDbData } from '../../test-data/db/corporate-actions.db';

// Extend the base test fixture
export const test = base.extend<{
    db: DatabaseHelper;
}>({
    db: async ({}, use) => {
        // Get database instance
        const db = DatabaseHelper.getInstance();
        
        // Setup: Clean tables and seed test data
        await db.cleanup(Object.values(corporateActionsDbData.tables));
        await db.seedTestData(
            corporateActionsDbData.tables.corporate_actions,
            corporateActionsDbData.testData.corporateActions
        );
        await db.seedTestData(
            corporateActionsDbData.tables.positions,
            corporateActionsDbData.testData.positions
        );
        
        // Use the fixture
        await use(db);
        
        // Cleanup after tests
        await db.cleanup(Object.values(corporateActionsDbData.tables));
    }
});
