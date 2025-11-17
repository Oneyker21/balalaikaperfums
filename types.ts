
export interface Category {
  id: string;
  name: string;
}

export interface SubCategory {
  id: string;
  categoryId: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  subCategoryId: string;
  featured?: boolean;
  outOfStock?: boolean;
}

export type ViewMode = 'CLIENT' | 'ADMIN';
export type AdminTab = 'PRODUCTS' | 'CATEGORIES';
