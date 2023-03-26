import Product from './product';

export default interface ProductResponse {
    items: Product[],
    totalItems: number,
    currentPage: number,
    totalPages: number
}
