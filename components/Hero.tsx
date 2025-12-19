import React from 'react';
import { ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToCatalog = () => {
    const catalogElement = document.getElementById('catalog');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative h-[60vh] md:h-[90vh] w-full overflow-hidden">
      {/* Parallax Background */}
      <div
        className="absolute inset-0 parallax opacity-80"
        style={{
          // Imagen local en `public/balalikas.jpeg`.
          backgroundImage: `url('/balalikas.jpeg')`,
          backgroundColor: '#0a0a0a',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          // Aplicamos blur y reducimos brillo para un fondo difuminado y más oscuro
          filter: 'blur(4px) brightness(0.80)'
        }}
      >
      </div>

      {/* Overlays for depth: oscurecimiento adicional pedido por el usuario */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-transparent to-black/70"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/80 to-black/50"></div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-10">
        <div className="animate-fade-in-up max-w-4xl">
          <div className="inline-block mb-3 md:mb-6 px-3 md:px-4 py-1 border border-brand-gold/30 rounded-full backdrop-blur-md bg-black/30">
            <h2 className="text-brand-gold tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs font-bold uppercase">
              Nueva Colección 2025
            </h2>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-8xl font-serif text-white mb-4 md:mb-8 drop-shadow-2xl leading-tight">
            Balalaika's d
            <span className="block text-xl md:text-3xl lg:text-4xl mt-2 md:mt-4 font-sans font-light text-gray-300 tracking-[0.3em] md:tracking-[0.5em] uppercase">Perfums</span>
          </h1>

          <div className="w-16 md:w-24 h-1 bg-brand-gold mx-auto mb-4 md:mb-8"></div>

          <p className="max-w-xl mx-auto text-gray-300 text-sm md:text-lg font-light leading-relaxed mb-6 md:mb-12 tracking-wide px-4">
            Descubre nuestra colección exclusiva de esencias.
            <span className="text-brand-gold"> Lujo y distinción</span> en cada gota.
          </p>
        </div>

        <div className="absolute bottom-6 md:bottom-10 animate-bounce">
          <ChevronDown className="h-5 w-5 md:h-6 md:w-6 text-white/50" />
        </div>
      </div>
    </div>
  );
};

export default Hero;