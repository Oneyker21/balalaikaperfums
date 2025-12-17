import React from 'react';
import { ArrowRight, Star, CheckCircle } from 'lucide-react';

interface LandingPageProps {
    onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
    return (
        <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-gold/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-green/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex-grow flex flex-col items-center justify-center px-4 text-center">

                {/* Brand Identity */}
                <div className="mb-8 animate-fade-in-up">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Star className="text-brand-gold w-6 h-6 fill-brand-gold" />
                        <span className="text-brand-gold text-xs font-bold tracking-[0.3em] uppercase">Premium Fragrances</span>
                        <Star className="text-brand-gold w-6 h-6 fill-brand-gold" />
                    </div>
                    <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 tracking-tight">
                        Balalaika's
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed mb-4">
                        Perfumes árabes y de diseñador en Juigalpa, Chontales 🇳🇮 <br />
                        <span className="text-brand-gold">Calidad real a buen precio</span>
                    </p>

                    {/* Subtexto */}
                    <p className="text-gray-500 text-sm md:text-base font-light max-w-2xl mx-auto">
                        Entregas rápidas • Pagos fáciles
                    </p>
                </div>

                {/* Trust Badges (Barra de Confianza) */}
                <div className="mb-10 animate-fade-in-up delay-100">
                    <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                        <div className="flex items-start gap-2 text-gray-400 text-xs md:text-sm">
                            <CheckCircle className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
                            <span>Entregamos en Juigalpa</span>
                        </div>
                        <div className="flex items-start gap-2 text-gray-400 text-xs md:text-sm">
                            <CheckCircle className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
                            <span>Enviamos a Managua, Carazo y Chontales</span>
                        </div>
                        <div className="flex items-start gap-2 text-gray-400 text-xs md:text-sm">
                            <CheckCircle className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
                            <span>Perfumes originales y sellados</span>
                        </div>
                        <div className="flex items-start gap-2 text-gray-400 text-xs md:text-sm">
                            <CheckCircle className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
                            <span>Atención directa por WhatsApp</span>
                        </div>
                        <div className="flex items-start gap-2 text-gray-400 text-xs md:text-sm md:col-span-2 justify-center md:justify-start">
                            <CheckCircle className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
                            <span>Pagos seguros</span>
                        </div>
                    </div>
                </div>

                {/* Catalog Button */}
                <button
                    onClick={onEnter}
                    className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-none transition-all duration-300 animate-fade-in-up delay-200"
                >
                    {/* Button Background & Border */}
                    <div className="absolute inset-0 border border-brand-gold/30 group-hover:border-brand-gold transition-colors duration-300"></div>
                    <div className="absolute inset-0 bg-brand-gold/0 group-hover:bg-brand-gold/10 transition-colors duration-300"></div>

                    {/* Button Content */}
                    <div className="relative flex items-center gap-4">
                        <span className="text-white font-bold text-sm tracking-[0.2em] uppercase group-hover:text-brand-gold transition-colors">
                            Explorar Catálogo
                        </span>
                        <ArrowRight className="w-5 h-5 text-brand-gold transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                </button>
            </div>

            {/* Footer / Decor */}
            <div className="relative z-10 py-8 text-center">
                <p className="text-white/20 text-[10px] uppercase tracking-[0.4em]">
                    Est. 2019 • Nicaragua
                </p>
            </div>
        </div>
    );
};

export default LandingPage;
