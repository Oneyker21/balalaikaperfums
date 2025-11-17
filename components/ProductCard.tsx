
import React from 'react';
import { Product } from '../types';
import { MessageCircle, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const PHONE_NUMBER = "50582332792"; 
  
  const handleWhatsAppClick = () => {
    if (product.outOfStock) return;

    const message = `Hola Balalaika's Perfums, estoy interesado en el perfume: ${product.name} de la marca ${product.brand}.`;
    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className={`group bg-brand-gray/40 backdrop-blur-sm border border-white/5 rounded-none overflow-hidden hover:border-brand-gold/50 transition-all duration-500 flex flex-col h-full relative ${product.outOfStock ? 'opacity-75 grayscale' : ''}`}>
      
      {/* Image Container */}
      <div className="relative h-80 overflow-hidden bg-black">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 group-hover:opacity-80 transition-all duration-700"
        />
        
        <div className="absolute top-0 right-0 flex flex-col items-end">
            {product.featured && !product.outOfStock && (
                <span className="bg-brand-gold text-black text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest mb-1">
                    Destacado
                </span>
            )}
            {product.outOfStock && (
                <span className="bg-red-900/90 text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest border-l border-b border-red-500">
                    Agotado
                </span>
            )}
        </div>
        
        {/* Overlay Button - WhatsApp */}
        <div className={`absolute inset-0 bg-black/60 opacity-0 ${!product.outOfStock ? 'group-hover:opacity-100' : ''} transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]`}>
             <button 
                onClick={handleWhatsAppClick}
                className="bg-brand-green text-white px-6 py-3 font-bold text-xs tracking-[0.2em] hover:bg-green-600 transition-colors uppercase transform translate-y-4 group-hover:translate-y-0 duration-300 flex items-center gap-2 border border-brand-green"
             >
                 <MessageCircle size={16} />
                 Comprar
             </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 flex flex-col flex-grow relative">
        {/* Subtle gradient line */}
        <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-brand-gold/40 transition-all duration-500"></div>

        <div className="mb-1 flex justify-between items-start">
            <h4 className="text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-1">
            {product.brand}
            </h4>
        </div>

        <h3 className="font-serif text-xl text-white mb-3 group-hover:text-brand-gold transition-colors duration-300">
          {product.name}
        </h3>
        
        <p className="text-gray-400 text-xs font-light leading-relaxed mb-6 flex-grow line-clamp-3">
          {product.description}
        </p>
        
        <div className="flex justify-between items-center pt-4 border-t border-white/5 group-hover:border-brand-gold/20 transition-colors">
            <span className={`text-lg font-medium ${product.outOfStock ? 'text-gray-500 line-through' : 'text-white'}`}>
                ${product.price.toFixed(2)}
            </span>
            <button 
                onClick={handleWhatsAppClick}
                disabled={product.outOfStock}
                className={`${product.outOfStock ? 'text-gray-600 cursor-not-allowed' : 'text-brand-gold hover:text-white'} transition-colors`}
            >
                <ShoppingBag size={20} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
