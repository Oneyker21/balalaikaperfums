
import React, { useState, useEffect } from 'react';
import { Product, Category, SubCategory } from '../types';
import ProductCard from './ProductCard';
import { Filter, SlidersHorizontal } from 'lucide-react';

interface CatalogProps {
  products: Product[];
  categories: Category[];
  subCategories: SubCategory[];
  searchQuery: string;
}

const Catalog: React.FC<CatalogProps> = ({ products, categories, subCategories, searchQuery }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('ALL');
  const [selectedGender, setSelectedGender] = useState<string>('ALL');

  // Reset subcategory (Brand) when category (Origin) changes
  useEffect(() => {
    setSelectedSubCategory('ALL');
  }, [selectedCategory]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || product.categoryId === selectedCategory;
    const matchesSubCategory = selectedSubCategory === 'ALL' || product.subCategoryId === selectedSubCategory;
    const matchesGender = selectedGender === 'ALL' || product.gender === selectedGender;

    return matchesSearch && matchesCategory && matchesSubCategory && matchesGender;
  }).sort((a, b) => {
    // Sort by Featured (true first), then by Name
    if (a.featured === b.featured) {
      return a.name.localeCompare(b.name);
    }
    return a.featured ? -1 : 1;
  });

  // In this new model: Categories are "Origins" (e.g., Arabes, Italianos)
  // Subcategories are "Brands" that belong to that origin
  const availableSubCategories = selectedCategory === 'ALL'
    ? []
    : subCategories.filter(sub => sub.categoryId === selectedCategory);

  return (
    <div id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-brand-black">

      <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-8">
        <div>
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-3">Colección Exclusiva</h2>
          <p className="text-gray-400 font-light tracking-wide">Perfumes árabes y de diseñador • Calidad real a buen precio • Entregas rápidas</p>
        </div>
        <div className="text-brand-gold text-sm mt-6 md:mt-0 font-mono">
          {filteredProducts.length} RESULTADOS
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">

        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="glass-panel p-6 rounded-sm sticky top-28">
            <div className="flex items-center gap-3 mb-8 text-brand-gold pb-4 border-b border-white/10">
              <SlidersHorizontal size={18} />
              <h3 className="font-bold text-xs uppercase tracking-[0.2em]">Filtrar Por</h3>
            </div>

            {/* Category Filter (Origin) */}
            <div className="mb-10">
              <h4 className="font-serif text-lg text-white mb-4">Categoría</h4>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setSelectedCategory('ALL')}
                    className={`w-full text-left px-4 py-2 text-sm transition-all border-l-2 ${selectedCategory === 'ALL' ? 'border-brand-gold text-brand-gold bg-white/5' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                  >
                    Ver Todo
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-4 py-2 text-sm transition-all border-l-2 ${selectedCategory === cat.id ? 'border-brand-gold text-brand-gold bg-white/5' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Gender Filter */}
            <div className="mb-10">
              <h4 className="font-serif text-lg text-white mb-4">Género</h4>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setSelectedGender('ALL')}
                    className={`w-full text-left px-4 py-2 text-sm transition-all border-l-2 ${selectedGender === 'ALL' ? 'border-brand-gold text-brand-gold bg-white/5' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                  >
                    Todos
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setSelectedGender('Masculino')}
                    className={`w-full text-left px-4 py-2 text-sm transition-all border-l-2 ${selectedGender === 'Masculino' ? 'border-brand-gold text-brand-gold bg-white/5' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                  >
                    Masculino
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setSelectedGender('Femenino')}
                    className={`w-full text-left px-4 py-2 text-sm transition-all border-l-2 ${selectedGender === 'Femenino' ? 'border-brand-gold text-brand-gold bg-white/5' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                  >
                    Femenino
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setSelectedGender('Unisex')}
                    className={`w-full text-left px-4 py-2 text-sm transition-all border-l-2 ${selectedGender === 'Unisex' ? 'border-brand-gold text-brand-gold bg-white/5' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                  >
                    Unisex
                  </button>
                </li>
              </ul>
            </div>

            {/* Subcategory Filter (Brand) - Only show if a category is selected */}
            <div className={`transition-all duration-500 overflow-hidden ${selectedCategory !== 'ALL' && availableSubCategories.length > 0 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <h4 className="font-serif text-lg text-white mb-4">Marcas</h4>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setSelectedSubCategory('ALL')}
                    className={`w-full text-left px-4 py-2 text-sm transition-all border-l-2 ${selectedSubCategory === 'ALL' ? 'border-brand-green text-brand-green bg-brand-green/10' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                  >
                    Todas las marcas
                  </button>
                </li>
                {availableSubCategories.map(sub => (
                  <li key={sub.id}>
                    <button
                      onClick={() => setSelectedSubCategory(sub.id)}
                      className={`w-full text-left px-4 py-2 text-sm transition-all border-l-2 ${selectedSubCategory === sub.id ? 'border-brand-green text-brand-green bg-brand-green/10' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                    >
                      {sub.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 glass-panel border border-dashed border-white/20 rounded-sm">
              <div className="text-4xl mb-4 opacity-50">✨</div>
              <h3 className="text-xl font-serif text-white mb-2">Sin resultados</h3>
              <p className="text-gray-500 text-sm">Intenta ajustar tus filtros de búsqueda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
