import React from 'react';
import { ArrowLeft, Store, Award, Shield } from 'lucide-react';

interface AboutUsProps {
    onBack: () => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-brand-black text-gray-200">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-b from-black to-brand-black border-b border-white/10 py-20">
                <div className="max-w-4xl mx-auto px-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-brand-gold hover:text-white transition-colors mb-8 text-sm uppercase tracking-wider"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver
                    </button>

                    <h1 className="font-serif text-4xl md:text-6xl text-white mb-6">
                        Sobre Nosotros
                    </h1>
                    <div className="w-24 h-1 bg-brand-gold"></div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="space-y-12">
                    {/* Main Description */}
                    <div className="glass-panel p-8 rounded-sm border border-white/5">
                        <p className="text-gray-300 text-lg leading-relaxed mb-6">
                            Somos <span className="text-brand-gold font-semibold">Balalaika's Perfums</span>, una tienda local especializada en fragancias árabes en Nicaragua.
                        </p>
                        <p className="text-gray-300 text-lg leading-relaxed mb-6">
                            Ofrecemos perfumes de alta duración, atención directa y entregas rápidas.
                        </p>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            Vendemos productos originales y sellados con pago contra entrega y transferencias.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-panel p-6 rounded-sm border border-white/5 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="p-3 bg-brand-gold/10 rounded-full">
                                    <Store className="w-8 h-8 text-brand-gold" />
                                </div>
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">Local en Nicaragua</h3>
                            <p className="text-gray-400 text-sm">Atención personalizada y directa</p>
                        </div>

                        <div className="glass-panel p-6 rounded-sm border border-white/5 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="p-3 bg-brand-gold/10 rounded-full">
                                    <Award className="w-8 h-8 text-brand-gold" />
                                </div>
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">Alta Duración</h3>
                            <p className="text-gray-400 text-sm">Fragancias que perduran todo el día</p>
                        </div>

                        <div className="glass-panel p-6 rounded-sm border border-white/5 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="p-3 bg-brand-gold/10 rounded-full">
                                    <Shield className="w-8 h-8 text-brand-gold" />
                                </div>
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">Productos Originales</h3>
                            <p className="text-gray-400 text-sm">100% originales y sellados</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
