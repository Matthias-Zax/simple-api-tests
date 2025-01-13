export const corporateActionsDbData = {
    tables: {
        corporate_actions: 'corporate_actions',
        positions: 'positions',
        messages: 'messages'
    },
    testData: {
        corporateActions: [
            {
                id: 1,
                zspa_id: 'ZSPA001',
                spa_id: 1001,
                isin_ident: 'DE0001234567',
                spa_datum: '2025-01-13',
                spa_canstat: 'ACTIVE',
                caev: 'DVCA',
                created_at: new Date().toISOString()
            },
            // Add more test records as needed
        ],
        positions: [
            {
                id: 1,
                corporate_action_id: 1,
                pos_nummer: '60684420000',
                pos_menge: 1000,
                pos_lgs: 'TEST',
                created_at: new Date().toISOString()
            }
            // Add more test records as needed
        ]
    },
    queries: {
        getCorporateActionById: `
            SELECT * FROM corporate_actions 
            WHERE zspa_id = $1
        `,
        getPositionsByAccountNumber: `
            SELECT p.* 
            FROM positions p
            JOIN corporate_actions ca ON p.corporate_action_id = ca.id
            WHERE p.pos_nummer = $1
        `,
        // Add more queries as needed
    }
};
