import { LanguageType } from './interfaces/api-interfaces';

export const corporateActionsTestData = {
    // Valid test data
    valid: {
        isin: 'AT0000A0VRQ6',
        zspaId: 'ZSPA123456789',
        spaId: 987654321,
        spaDatum: '2025-01-13',
        posMenge: 1000,
        accountNumber: '60684420000',
        withdrawalReason: 'Data correction required',
        withdrawalComment: 'Additional information needs to be added',
        canTypeId: 'DVCA',  // Dividend Corporate Action
        spaCanstat: 'ACTIVE',
        spaStatus: 'NEW',
        gig: {
            dateFrom: '2025-01-01',
            dateTo: '2025-12-31',
            accountNumbers: ['60684420000', '60684423420'],
            cantypCaevs: ['TEND', 'DVCA'],
            functionOfMessage: ['NEWM', 'REPL'],
            camv: ['CHOS', 'VOLU', 'MAND'],
            language: 'EN' as LanguageType,
            isin: 'AT0000A0VRQ6'
        }
    },
    // Invalid test data for error scenarios
    invalid: {
        isin: 'INVALID-ISIN',
        zspaId: 'INVALID-ZSPA',
        spaId: -1,
        invalidFormat: {
            zspaId: '123', // too short
            spaId: 'abc',  // not a number
            isin: '123'    // invalid ISIN format
        },
        gig: {
            dateFrom: '2024-13-45',  // invalid date
            dateTo: '2024-13-45',    // invalid date
            accountNumbers: ['invalid-account'],
            cantypCaevs: ['INVALID'],
            functionOfMessage: ['INVALID'],
            camv: ['INVALID'],
            language: 'FR' as LanguageType,  // invalid language
            isin: '123'  // invalid ISIN format
        }
    },
    // Sample response data for mocking
    sampleResponses: {
        details: {
            zspaId: 'ZSPA123456789',
            spaId: 987654321,
            isinIdent: 'AT0000A0VRQ6',
            spaDatum: '2025-01-13',
            posMenge: 1000,
            zspaInstructableViaGIG: 'Y',
            lastReleaseDate: '2025-01-13T14:10:05+01:00',
            language: 'EN',
            caev: 'TEND',
            camv: 'VOLU'
        },
        positions: {
            zspaId: 'ZSPA123456789',
            positions: [
                {
                    accountNumber: '60684420000',
                    posMenge: 1000,
                    posLgs: 'LONG',
                    posNummer: 'POS001'
                },
                {
                    accountNumber: '60684423420',
                    posMenge: 500,
                    posLgs: 'LONG',
                    posNummer: 'POS002'
                }
            ]
        }
    },
    // Pagination and sorting defaults
    defaults: {
        page: 0,
        pageSize: 10,
        sort: 'spaDatum',
        order: 'desc' as const
    }
};
