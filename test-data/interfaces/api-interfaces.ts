// Common types from shared resources
export type YesNoStatus = 'Y' | 'N';
export type LanguageType = 'DE' | 'EN';
export type ZspaStatus = 'ACTIVE' | 'INACTIVE';
export type ActiveStatus = 'ACTIVE' | 'INACTIVE';
export type ZspaWfStatus = 'OPEN' | 'CLOSED' | 'CANCELLED';
export type AgentDisclosureStatus = 'OPEN' | 'CLOSED';
export type SpaCanStatus = 'PRE' | 'ADV' | 'REM';
export type CanTypeId = 'DVCA' | 'TEND' | 'BIDS' | 'INTR' | 'REDM' | 'EXRI';
export type SpaCanstat = 'ACTIVE' | 'INACTIVE' | 'PENDING';
export type SpaStatus = 'NEW' | 'PROCESSED' | 'RELEASED' | 'WITHDRAWN';

// GIG API Request Parameters
export interface GIGParamsInBody {
    dateFrom?: string;  // format: date, example: 2017-07-21
    dateTo?: string;    // format: date, example: 2017-07-21
    accountNumbers?: string[];  // example: ['60684420000', '60684423420']
    cantypCaevs?: string[];    // example: ['TEND']
    functionOfMessage?: string[];  // example: ['NEWM', 'REPL']
    camv?: string[];    // example: ['CHOS', 'VOLU', 'MAND']
    language?: LanguageType;  // example: 'EN'
    isin?: string;      // ISIN format validation
}

// Search Results
export interface SearchCanInstanceResultWithPos {
    posMenge?: number;
    posLgs?: string;
    posNummer?: string;
    positId?: string;
    posId?: number;
    zspaId?: string;
    spaId?: number;
    isinIdent?: string;
    corpRef?: string;
    src?: string;
    spaDatum?: string;  // format: date
    spaCanstat?: SpaCanStatus;
    bezeichnung?: string;
    caev?: string;
    functionOfMessage?: string;
    camv?: string;
    lastReleaseDate?: string;  // format: date-time
    firstReleaseDate?: string; // format: date-time
    rddt?: string;
    zspaInstructableViaGIG?: YesNoStatus;
}

// Search Types
export interface SearchParams {
    isin?: string;
    canTypeId?: CanTypeId;
    spaCanstat?: SpaCanstat;
    spaStatus?: SpaStatus;
    page?: number;
    pageSize?: number;
    sort?: string;
    order?: 'asc' | 'desc';
}

// Corporate Action Details Types
export interface CorpActionDetails {
    zspaId: string;
    spaId: number;
    isinIdent: string;
    spaDatum: string;  // format: date
    posMenge?: number;
    zspaInstructableViaGIG?: YesNoStatus;
    lastReleaseDate?: string;  // format: date-time
    language?: LanguageType;
    caev?: string;
    camv?: string;
}

export interface CorpActionReference {
    zspaId: string;
    caev?: string;
    camv?: string;
    corpRef?: string;
    bezeichnung?: string;
    spaDatum?: string;  // format: date
}

export interface CanPosition {
    accountNumber: string;
    posMenge?: number;
    posLgs?: string;
    posNummer?: string;
}

export interface CanPosResponse {
    zspaId: string;
    positions: CanPosition[];
}

// Pagination Parameters (Query Parameters)
export interface PaginationParams {
    page?: number;
    pageSize?: number;
    sort?: string;
    order?: 'asc' | 'desc';
}

// Response Types
export interface SearchResponse<T> {
    content: T[];
    totalElements?: number;
    totalPages?: number;
    size?: number;
    number?: number;
}

// History Types
export interface HistoryEntry {
    zspaId: string;
    spaId: number;
    actionType: string;
    timestamp: string;  // format: date-time
    userId?: string;
    details?: string;
    status?: string;
    actionResult?: string;
    systemInfo?: {
        version?: string;
        environment?: string;
    };
}

export interface HistoryResponse {
    entries: HistoryEntry[];
    totalCount: number;
}

// Management Types
export interface WithdrawRequest {
    zspaId: string;
    reason: string;
    comment?: string;
    metadata?: {
        requestId?: string;
        source?: string;
    };
}

export interface WithdrawResponse {
    success: boolean;
    zspaId: string;
    timestamp: string;  // format: date-time
    message?: string;
    status?: string;
    requestId?: string;
}
