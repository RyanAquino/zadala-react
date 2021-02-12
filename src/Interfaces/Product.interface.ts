export interface Product {
  id: number;
  name: string;
  description: string;
  digital: boolean;
  price: number;
  image: string;
  quantity: number;
  created_at: string;
  supplier: number;
}

export interface ProductsList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}
