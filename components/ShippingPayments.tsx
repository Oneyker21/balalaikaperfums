import React from 'react';
import { ArrowLeft, Truck, CreditCard, MapPin } from 'lucide-react';

interface ShippingPaymentsProps {
    onBack: () => void;
}

const ShippingPayments: React.FC<ShippingPaymentsProps> = ({ onBack }) => {
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
                        Envíos y Pagos
                    </h1>
                    <div className="w-24 h-1 bg-brand-gold"></div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="space-y-8">
                    {/* Shipping Section */}
                    <div className="glass-panel p-8 rounded-sm border border-white/5">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-brand-green/10 rounded-full">
                                <Truck className="w-6 h-6 text-brand-green" />
                            </div>
                            <h2 className="text-2xl font-serif text-white">Envíos</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <MapPin className="w-5 h-5 text-brand-gold flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-white font-semibold mb-2">Entregas en Juigalpa</h3>
                                    <p className="text-gray-400">En 24 horas directo a tu puerta.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <Truck className="w-5 h-5 text-brand-gold flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-white font-semibold mb-2">Otros Departamentos</h3>
                                    <p className="text-gray-400">
                                        Envíos a otros departamentos por transporte nacional bajo coordinación por WhatsApp.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Section */}
                    <div className="glass-panel p-8 rounded-sm border border-white/5">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-brand-gold/10 rounded-full">
                                <CreditCard className="w-6 h-6 text-brand-gold" />
                            </div>
                            <h2 className="text-2xl font-serif text-white">Pagos</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-300">
                                <div className="w-2 h-2 bg-brand-gold rounded-full"></div>
                                <span>Pago contra entrega (efectivo)</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <div className="w-2 h-2 bg-brand-gold rounded-full"></div>
                                <span>Transferencia bancaria</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact CTA */}
                    <div className="bg-gradient-to-r from-brand-green/10 to-brand-gold/10 p-8 rounded-sm border border-brand-gold/20">
                        <p className="text-center text-gray-300 text-lg">
                            ¿Tienes dudas sobre tu pedido?
                            <span className="block mt-2 text-brand-gold font-semibold">
                                Contáctanos por WhatsApp: +505 8233 2792
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingPayments;
