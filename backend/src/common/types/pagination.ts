/**
 * Pagination Response Type
 * 
 * Shared generic type for paginated responses across all modules.
 * Use this type for any endpoint that returns paginated data.
 */

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}
