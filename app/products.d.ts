export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  brand: string;
  featured: boolean;
  weight?: number;
  score?: number;
}

declare const products: Product[];
export { products }; 