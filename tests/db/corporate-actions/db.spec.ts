import { test, expect } from '../fixtures/db-fixtures';
import { corporateActionsDbData as dbData } from '../../test-data/db/corporate-actions.db';

test.describe('Corporate Actions Database Tests', () => {
    test('T1_DB_GetCorporateAction_ValidId_ReturnsCorrectData', async ({ db }) => {
        // Query the database
        const result = await db.queryOne(
            dbData.queries.getCorporateActionById,
            [dbData.testData.corporateActions[0].zspa_id]
        );

        // Verify the result
        expect(result).toBeDefined();
        expect(result).toMatchObject({
            zspa_id: dbData.testData.corporateActions[0].zspa_id,
            spa_id: dbData.testData.corporateActions[0].spa_id,
            isin_ident: dbData.testData.corporateActions[0].isin_ident,
            spa_canstat: dbData.testData.corporateActions[0].spa_canstat,
            caev: dbData.testData.corporateActions[0].caev
        });
    });

    test('T1_DB_GetPositions_ValidAccountNumber_ReturnsCorrectPositions', async ({ db }) => {
        // Query the database
        const results = await db.query(
            dbData.queries.getPositionsByAccountNumber,
            [dbData.testData.positions[0].pos_nummer]
        );

        // Verify the results
        expect(results).toHaveLength(1);
        expect(results[0]).toMatchObject({
            pos_nummer: dbData.testData.positions[0].pos_nummer,
            pos_menge: dbData.testData.positions[0].pos_menge,
            pos_lgs: dbData.testData.positions[0].pos_lgs
        });
    });

    test('T4_DB_GetCorporateAction_InvalidId_ReturnsNull', async ({ db }) => {
        // Query with invalid ID
        const result = await db.queryOne(
            dbData.queries.getCorporateActionById,
            ['INVALID_ID']
        );

        // Verify null result
        expect(result).toBeNull();
    });
});
