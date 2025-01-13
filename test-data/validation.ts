export interface IsinFormat {
    countryCode: string;  // 2 characters
    identifier: string;   // 9 characters
    checkDigit: string;  // 1 character
}

export class TestDataValidator {
    static isValidIsin(isin: string): boolean {
        const isinRegex = /^[A-Z]{2}[A-Z0-9]{9}\d$/;
        return isinRegex.test(isin);
    }

    static parseIsin(isin: string): IsinFormat | null {
        if (!this.isValidIsin(isin)) return null;
        
        return {
            countryCode: isin.substring(0, 2),
            identifier: isin.substring(2, 11),
            checkDigit: isin.substring(11, 12)
        };
    }

    static isValidZspaId(zspaId: string): boolean {
        const zspaIdRegex = /^\d{1,10}$/;
        return zspaIdRegex.test(zspaId);
    }

    static isValidSpaId(spaId: string): boolean {
        const spaIdRegex = /^\d{1,10}$/;
        return spaIdRegex.test(spaId);
    }

    static isValidCanTypeId(canTypeId: number): boolean {
        return Number.isInteger(canTypeId) && canTypeId > 0;
    }

    static isValidPagination(page: number, pageSize: number): boolean {
        return Number.isInteger(page) && 
               Number.isInteger(pageSize) && 
               page >= 0 && 
               pageSize > 0;
    }
}
