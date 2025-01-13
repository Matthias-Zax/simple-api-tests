import { LanguageType } from './interfaces/api-interfaces';

export const corporateActionsTestData = {
    // Valid test data
    valid: {
        isin: 'AT0000A0VRQ6',
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
    // Pagination and sorting defaults
    defaults: {
        page: 0,
        pageSize: 10,
        sort: 'spaDatum',
        order: 'desc' as const
    }
};
