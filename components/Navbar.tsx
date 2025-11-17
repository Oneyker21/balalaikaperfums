import React, { useState } from 'react';
import { Menu, X, Search, ShieldCheck, LogOut, ShoppingBag, User } from 'lucide-react';
import { ViewMode } from '../types';
import { auth } from '../firebase';

interface NavbarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  user: any;
}

const Navbar: React.FC<NavbarProps> = ({ viewMode, setViewMode, searchQuery, setSearchQuery, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    auth.signOut();
    setViewMode('CLIENT');
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer group" onClick={() => setViewMode('CLIENT')}>
            <div className="relative mr-3">
              <div className="absolute -inset-1 bg-brand-gold rounded-full opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
              <ShoppingBag className="relative h-8 w-8 text-brand-gold" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-wider text-white group-hover:text-brand-gold transition-colors duration-300">
                BALALAIKA'S
              </span>
              <span className="text-[10px] tracking-[0.4em] uppercase text-brand-green font-bold">
                Perfums
              </span>
            </div>
          </div>

          {/* Desktop Search & Admin Toggle */}
          <div className="hidden md:flex items-center space-x-8">
            {viewMode === 'CLIENT' && (
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Buscar perfume..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/5 text-white border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold w-64 transition-all placeholder-gray-500 group-hover:bg-white/10"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-brand-gold/70" />
              </div>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setViewMode(viewMode === 'CLIENT' ? 'ADMIN' : 'CLIENT')}
                  className={`flex items-center px-4 py-2 rounded-sm transition-all duration-300 uppercase text-xs tracking-widest font-bold border ${
                    viewMode === 'ADMIN' 
                      ? 'bg-brand-green border-brand-green text-white shadow-[0_0_15px_rgba(2,104,66,0.4)]' 
                      : 'border-transparent text-gray-400 hover:text-brand-gold hover:border-brand-gold'
                  }`}
                >
                  {viewMode === 'CLIENT' ? 'Panel Admin' : 'Ver Catálogo'}
                </button>
                <button onClick={handleLogout} title="Cerrar Sesión">
                  <LogOut className="h-5 w-5 text-gray-400 hover:text-red-400 transition-colors" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setViewMode('ADMIN')}
                className="flex items-center text-gray-400 hover:text-brand-gold transition-colors text-xs uppercase tracking-widest"
              >
                <User className="h-4 w-4 mr-2" />
                Admin
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-brand-gold hover:text-white p-2 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black border-b border-white/10 animate-fade-in">
          <div className="px-4 pt-2 pb-6 space-y-4">
             {viewMode === 'CLIENT' && (
              <div className="relative mt-4">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 text-white border border-white/10 rounded-sm py-3 pl-10 pr-4 focus:outline-none focus:border-brand-gold"
                />
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-brand-gold" />
              </div>
             )}
            <button
              onClick={() => {
                setViewMode(viewMode === 'CLIENT' ? 'ADMIN' : 'CLIENT');
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center justify-center px-4 py-3 border border-brand-gold text-brand-gold uppercase text-xs tracking-widest font-bold hover:bg-brand-gold hover:text-black transition-colors mt-4"
            >
              {viewMode === 'CLIENT' ? 'Ir a Administración' : 'Volver al Catálogo'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;