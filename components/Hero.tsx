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
    <div className="relative h-[90vh] w-full overflow-hidden">
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 parallax opacity-80"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1557170334-a9632e77c6e4?q=80&w=2500&auto=format&fit=crop')`,
          backgroundColor: '#0a0a0a' 
        }}
      >
      </div>
      
      {/* Overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black"></div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-10">
        <div className="animate-fade-in-up max-w-4xl">
            <div className="inline-block mb-6 px-4 py-1 border border-brand-gold/30 rounded-full backdrop-blur-md bg-black/30">
                <h2 className="text-brand-gold tracking-[0.3em] text-xs font-bold uppercase">
                    Nueva Colección 2025
                </h2>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-serif text-white mb-8 drop-shadow-2xl leading-tight">
                Balalaika's
                <span className="block text-3xl md:text-4xl mt-4 font-sans font-light text-gray-300 tracking-[0.5em] uppercase">Perfums</span>
            </h1>
            
            <div className="w-24 h-1 bg-brand-gold mx-auto mb-8"></div>

            <p className="max-w-xl mx-auto text-gray-300 text-lg font-light leading-relaxed mb-12 tracking-wide">
                Descubre nuestra colección exclusiva de esencias. 
                <span className="text-brand-gold"> Lujo, frescura y distinción</span> en cada gota.
            </p>
            
            <button 
                onClick={scrollToCatalog}
                className="group relative px-10 py-4 bg-transparent text-white font-bold text-sm tracking-[0.2em] border border-white/30 hover:border-brand-gold transition-all duration-500 overflow-hidden"
            >
                <span className="relative z-10 group-hover:text-black transition-colors duration-500">EXPLORAR CATÁLOGO</span>
                <div className="absolute inset-0 bg-brand-gold transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out"></div>
            </button>
        </div>
        
        <div className="absolute bottom-10 animate-bounce">
            <ChevronDown className="h-6 w-6 text-white/50" />
        </div>
      </div>
    </div>
  );
};

export default Hero;