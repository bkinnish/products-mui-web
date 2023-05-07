import Brand from "./brand";

export default interface BrandResponse {
  items: Brand[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}
