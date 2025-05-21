export interface PaginationResponse<T> {
    records: Array<T>;
    total: number;
    size: number;
    current: number;
}