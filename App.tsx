import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Catalog from './components/Catalog';
import AdminDashboard from './components/Admin/AdminDashboard';
import LandingPage from './components/LandingPage';
import AboutUs from './components/AboutUs';
import ShippingPayments from './components/ShippingPayments';
import { Category, Product, SubCategory, ViewMode } from './types';
import { db, auth } from './firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  // State Management
  const [viewMode, setViewMode] = useState<ViewMode>('LANDING');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Firebase Data Fetching
  useEffect(() => {
    setLoading(true);

    // Subscribe to Categories
    const unsubCategories = onSnapshot(query(collection(db, 'categories'), orderBy('name')), (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
    });

    // Subscribe to SubCategories
    const unsubSubCategories = onSnapshot(query(collection(db, 'subCategories'), orderBy('name')), (snapshot) => {
      setSubCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SubCategory)));
    });

    // Subscribe to Products
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
      setLoading(false);
    });

    // Auth State Listener
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      unsubCategories();
      unsubSubCategories();
      unsubProducts();
      unsubAuth();
    };
  }, []);

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-brand-gold animate-pulse font-serif text-2xl tracking-widest">BALALAIKA'S...</div>
      </div>
    );
  }

  if (viewMode === 'LANDING') {
    return <LandingPage onEnter={() => setViewMode('CLIENT')} />;
  }

  if (viewMode === 'ABOUT') {
    return <AboutUs onBack={() => setViewMode('CLIENT')} />;
  }

  if (viewMode === 'SHIPPING') {
    return <ShippingPayments onBack={() => setViewMode('CLIENT')} />;
  }

  return (
    <div className="min-h-screen bg-brand-black flex flex-col text-gray-200">
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        user={user}
      />

      <main className="flex-grow">
        {viewMode === 'CLIENT' ? (
          <>
            <Hero />
            <Catalog
              products={products}
              categories={categories}
              subCategories={subCategories}
              searchQuery={searchQuery}
            />

            {/* Footer */}
            <footer className="bg-black text-white py-16 mt-12 border-t border-white/5">
              <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
                <div>
                  <h3 className="font-serif text-2xl mb-6 text-brand-gold">Balalaika's</h3>
                  <p className="text-gray-500 text-sm leading-loose font-light">
                    Descubre el Lugar indicado en fragancias y escencias. Lujo, calidad y distinción.
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-bold uppercase tracking-[0.2em] text-xs mb-6">Información</h4>
                  <div className="space-y-3 text-gray-500 text-sm font-light">
                    <button onClick={() => setViewMode('ABOUT')} className="block hover:text-brand-gold transition-colors text-left">Sobre Nosotros</button>
                    <button onClick={() => setViewMode('SHIPPING')} className="block hover:text-brand-gold transition-colors text-left">Envíos y Pagos</button>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-bold uppercase tracking-[0.2em] text-xs mb-6">Contacto</h4>
                  <div className="space-y-4 text-gray-500 text-sm font-light">
                    <p>+505 5880 4436</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-bold uppercase tracking-[0.2em] text-xs mb-6">Redes Sociales</h4>
                  <div className="flex space-x-6">
                    <a href="https://www.instagram.com/balalaika.perfum" className="text-gray-500 hover:text-brand-gold transition-colors">Instagram</a>
                  </div>
                </div>
              </div>
              <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-white/5">
                <div className="flex justify-between items-center text-xs text-gray-600 uppercase tracking-widest">
                  {/* Codevia - Left */}
                  <div>
                    &copy; {new Date().getFullYear()}{' '}
                    <a href="https://www.instagram.com/codeviadev" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors">
                      Codevia
                    </a>
                  </div>

                  {/* Balalaika's - Center */}
                  <div className="text-center">
                    2019 - {new Date().getFullYear()} Balalaika's d Perfums
                  </div>

                  {/* Empty space for balance */}
                  <div className="w-20"></div>
                </div>
              </div>
            </footer>
          </>
        ) : (
          <AdminDashboard
            categories={categories}
            subCategories={subCategories}
            user={user}
          />
        )}
      </main>
    </div>
  );
}

export default App;