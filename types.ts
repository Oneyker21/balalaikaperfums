
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
  priceCordobas?: number;
  imageUrl: string;
  categoryId: string;
  subCategoryId: string;
  featured?: boolean;
  outOfStock?: boolean;
  discount?: number; // Porcentaje de descuento (0-100)
  gender?: 'Masculino' | 'Femenino' | 'Unisex'; // Género del perfume
}

export type ViewMode = 'LANDING' | 'CLIENT' | 'ADMIN' | 'ABOUT' | 'SHIPPING';
export type AdminTab = 'PRODUCTS' | 'CATEGORIES';
