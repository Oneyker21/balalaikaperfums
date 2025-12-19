
import React from 'react';
import { Product } from '../types';
import { MessageCircle, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const PHONE_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "50558804436";

  const formatPrice = (price: number) => {
    const roundedPrice = Math.round(price * 100) / 100;
    if (roundedPrice % 1 === 0) {
      return price.toString();
    }
    return roundedPrice.toFixed(2);
  };

  // Calculate discounted price
  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount ? product.price * (1 - product.discount! / 100) : product.price;
  const discountedPriceCordobas = hasDiscount && product.priceCordobas ? product.priceCordobas * (1 - product.discount! / 100) : product.priceCordobas;

  const handleWhatsAppClick = () => {
    if (product.outOfStock) return;

    const finalPrice = hasDiscount ? discountedPrice : product.price;
    const finalPriceCordobas = hasDiscount ? discountedPriceCordobas : product.priceCordobas;
    const priceCordobasText = finalPriceCordobas ? `/ C$${formatPrice(finalPriceCordobas)}` : '';
    const discountText = hasDiscount ? ` (${product.discount}% OFF - antes $${formatPrice(product.price)})` : '';
    const message = `Hola Balalaika's Perfums, estoy interesado en el perfume: ${product.name} de ${product.brand}. Precio: $${formatPrice(finalPrice)} ${priceCordobasText}${discountText}`;
    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className={`group bg-brand-gray/40 backdrop-blur-sm border border-white/5 rounded-none overflow-hidden hover:border-brand-gold/50 transition-all duration-500 flex flex-col h-full relative ${product.outOfStock ? 'opacity-75 grayscale' : ''}`}>

      {/* Image Container */}
      <div className="relative h-56 md:h-80 overflow-hidden bg-black">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 group-hover:opacity-80 transition-all duration-700"
        />

        <div className="absolute top-0 right-0 flex flex-col items-end">
          {product.featured && !product.outOfStock && (
            <span className="bg-brand-gold text-black text-[8px] md:text-[10px] font-bold px-2 md:px-3 py-1 md:py-1.5 uppercase tracking-wider md:tracking-widest mb-1">
              Destacado
            </span>
          )}
          {hasDiscount && !product.outOfStock && (
            <span className="bg-red-600 text-white text-[8px] md:text-[10px] font-bold px-2 md:px-3 py-1 md:py-1.5 uppercase tracking-wider md:tracking-widest mb-1">
              -{product.discount}% OFF
            </span>
          )}
          {product.outOfStock && (
            <span className="bg-red-900/90 text-white text-[8px] md:text-[10px] font-bold px-2 md:px-3 py-1 md:py-1.5 uppercase tracking-wider md:tracking-widest border-l border-b border-red-500">
              Agotado
            </span>
          )}
        </div>

        {/* Overlay Button - WhatsApp */}
        <div className={`absolute inset-0 bg-black/60 opacity-0 ${!product.outOfStock ? 'group-hover:opacity-100' : ''} transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]`}>
          <button
            onClick={handleWhatsAppClick}
            className="bg-brand-green text-white px-4 md:px-6 py-2 md:py-3 font-bold text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.2em] hover:bg-green-600 transition-colors uppercase transform translate-y-4 group-hover:translate-y-0 duration-300 flex items-center gap-1.5 md:gap-2 border border-brand-green"
          >
            <MessageCircle size={14} className="md:w-4 md:h-4" />
            Comprar
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 flex flex-col flex-grow relative">
        {/* Subtle gradient line */}
        <div className="absolute top-0 left-4 right-4 md:left-6 md:right-6 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-brand-gold/40 transition-all duration-500"></div>

        <div className="mb-1 flex justify-between items-start">
          <h4 className="text-[9px] md:text-[10px] font-bold text-brand-gold uppercase tracking-wider md:tracking-widest mb-1">
            {product.brand}
          </h4>
        </div>

        <h3 className="font-serif text-lg md:text-xl text-white mb-2 md:mb-3 group-hover:text-brand-gold transition-colors duration-300">
          {product.name}
        </h3>

        <p className="text-gray-400 text-[11px] md:text-xs font-light leading-relaxed mb-4 md:mb-6 flex-grow line-clamp-3">
          {product.description}
        </p>

        <div className="flex justify-between items-center pt-3 md:pt-4 border-t border-white/5 group-hover:border-brand-gold/20 transition-colors">
          <div className="flex flex-col">
            {hasDiscount && !product.outOfStock ? (
              <>
                <span className="text-[10px] md:text-xs text-gray-500 line-through">
                  ${formatPrice(product.price)}
                </span>
                <span className="text-lg md:text-xl font-bold text-brand-green">
                  ${formatPrice(discountedPrice)}
                </span>
                {discountedPriceCordobas && discountedPriceCordobas > 0 && (
                  <span className="text-[10px] md:text-xs text-brand-green/70">C${formatPrice(discountedPriceCordobas)}</span>
                )}
              </>
            ) : (
              <div className={`${product.outOfStock ? 'text-gray-500 line-through' : 'text-white'}`}>
                <span className="text-base md:text-lg font-medium">
                  ${formatPrice(product.price)}
                </span>
                {product.priceCordobas && product.priceCordobas > 0 && (
                  <span className="text-[10px] md:text-xs text-gray-400 block">C${formatPrice(product.priceCordobas)}</span>
                )}
              </div>
            )}
          </div>
          <button
            onClick={handleWhatsAppClick}
            disabled={product.outOfStock}
            className={`${product.outOfStock ? 'text-gray-600 cursor-not-allowed' : 'text-brand-gold hover:text-white'} transition-colors`}
          >
            <ShoppingBag size={18} className="md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
