
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Package, Tag, Upload, LogIn, AlertCircle, Search, X, Check, XCircle, Pencil, Save, XSquare } from 'lucide-react';
import { Product, Category, SubCategory, AdminTab } from '../../types';
import { auth, db } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';

interface AdminDashboardProps {
    categories: Category[];
    subCategories: SubCategory[];
    user: any;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
    categories,
    subCategories,
    user
}) => {
    const [activeTab, setActiveTab] = useState<AdminTab>('PRODUCTS');
    const [products, setProducts] = useState<Product[]>([]);


    // Filters for Admin Catalog
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>('ALL');

    // Auth State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    // Modal State for Products
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProductId, setEditingProductId] = useState<string | null>(null);

    // Product Form State
    const initialProductState = {
        name: '', brand: '', description: '', price: null, priceCordobas: null, imageUrl: '', categoryId: '', subCategoryId: '', featured: false, outOfStock: false, discount: 0
    };
    const [productFormData, setProductFormData] = useState<Partial<Product>>(initialProductState);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Category Form State
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newSubCatName, setNewSubCatName] = useState('');
    const [newSubCatParent, setNewSubCatParent] = useState('');

    // Inline Editing States
    const [editingCategory, setEditingCategory] = useState<{ id: string, name: string } | null>(null);
    const [editingSubCategory, setEditingSubCategory] = useState<{ id: string, name: string } | null>(null);

    // Listen to products
    useEffect(() => {
        if (user) {
            const unsub = onSnapshot(collection(db, 'products'), (snap) => {
                setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
            });
            return () => unsub();
        }
    }, [user]);

    // Filter Logic
    useEffect(() => {
        setSelectedSubCategory('ALL');
    }, [selectedCategory]);

    const filteredProducts = products.filter(product => {
        const q = searchQuery.toLowerCase();
        const name = (product.name || '').toString().toLowerCase();
        const brand = (product.brand || '').toString().toLowerCase();
        const matchesSearch = name.includes(q) || brand.includes(q);

        const matchesCategory = selectedCategory === 'ALL' || product.categoryId === selectedCategory;
        const matchesSubCategory = selectedSubCategory === 'ALL' || product.subCategoryId === selectedSubCategory;

        return matchesSearch && matchesCategory && matchesSubCategory;
    });

    const availableSubCategories = selectedCategory === 'ALL'
        ? []
        : subCategories.filter(sub => sub.categoryId === selectedCategory);


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setLoginError('');
        } catch (error: any) {
            setLoginError('Error de autenticación: ' + error.message);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const MAX_WIDTH = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx?.drawImage(img, 0, 0, width, height);

                    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    setProductFormData({ ...productFormData, imageUrl: dataUrl });
                    setImagePreview(dataUrl);
                };
                img.src = event.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    // --- PRODUCT ACTIONS ---
    const openAddModal = () => {
        setEditingProductId(null);
        setProductFormData(initialProductState);
        setImagePreview(null);
        setIsModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProductId(product.id);
        // Fill form with existing data, providing defaults for optional fields
        setProductFormData({
            name: product.name,
            brand: product.brand,
            description: product.description,
            price: product.price,
            priceCordobas: product.priceCordobas,
            imageUrl: product.imageUrl,
            categoryId: product.categoryId,
            subCategoryId: product.subCategoryId,
            featured: product.featured || false,
            outOfStock: product.outOfStock || false,
            discount: product.discount || 0
        });
        setImagePreview(product.imageUrl);
        setIsModalOpen(true);
    };

    const handleProductSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!productFormData.name || !productFormData.categoryId) return;

        const subCatName = subCategories.find(s => s.id === productFormData.subCategoryId)?.name;
        const finalBrandName = subCatName || productFormData.brand || 'Generic';

        try {
            const productData = {
                name: productFormData.name,
                brand: finalBrandName,
                description: productFormData.description,
                price: Number(productFormData.price),
                priceCordobas: Number(productFormData.priceCordobas) || 0,
                imageUrl: productFormData.imageUrl,
                categoryId: productFormData.categoryId,
                subCategoryId: productFormData.subCategoryId,
                featured: productFormData.featured,
                outOfStock: productFormData.outOfStock || false,
                discount: Number(productFormData.discount) || 0
            };

            if (editingProductId) {
                await updateDoc(doc(db, 'products', editingProductId), productData);
            } else {
                await addDoc(collection(db, 'products'), productData);
            }

            setIsModalOpen(false);
            setProductFormData(initialProductState);
            setImagePreview(null);
        } catch (error) {
            console.error("Error saving product: ", error);
            alert('Error al guardar producto. Revisa la consola.');
        }
    };

    const deleteProduct = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('¿Estás seguro de borrar este producto permanentemente?')) {
            try {
                await deleteDoc(doc(db, 'products', id));
            } catch (error: any) {
                console.error("Error deleting product:", error);
                alert("No se pudo eliminar: " + error.message);
            }
        }
    };

    const toggleStock = async (product: Product, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const ref = doc(db, 'products', product.id);
            await updateDoc(ref, {
                outOfStock: !product.outOfStock
            });
        } catch (error: any) {
            console.error("Error updating stock", error);
            alert("Error al actualizar stock: " + error.message);
        }
    };

    // --- CATEGORY ACTIONS ---
    const handleCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName) return;
        try {
            await addDoc(collection(db, 'categories'), { name: newCategoryName });
            setNewCategoryName('');
        } catch (e: any) {
            alert("Error: " + e.message);
        }
    };

    const deleteCategory = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('¿Eliminar esta categoría (Origen)? Se borrará del listado.')) {
            try {
                await deleteDoc(doc(db, 'categories', id));
            } catch (err: any) {
                console.error(err);
                alert("Error al eliminar: " + err.message);
            }
        }
    };

    const saveCategoryEdit = async () => {
        if (!editingCategory) return;
        try {
            await updateDoc(doc(db, 'categories', editingCategory.id), { name: editingCategory.name });
            setEditingCategory(null);
        } catch (err: any) {
            console.error(err);
            alert("Error al guardar: " + err.message);
        }
    };

    // --- SUBCATEGORY ACTIONS ---
    const handleSubCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSubCatName || !newSubCatParent) return;
        try {
            await addDoc(collection(db, 'subCategories'), { name: newSubCatName, categoryId: newSubCatParent });
            setNewSubCatName('');
        } catch (e: any) {
            alert("Error: " + e.message);
        }
    };

    const deleteSubCategory = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm('¿Eliminar esta marca?')) {
            try {
                await deleteDoc(doc(db, 'subCategories', id));
            } catch (err: any) {
                console.error(err);
                alert("Error al eliminar: " + err.message);
            }
        }
    };

    const saveSubCategoryEdit = async () => {
        if (!editingSubCategory) return;
        try {
            await updateDoc(doc(db, 'subCategories', editingSubCategory.id), { name: editingSubCategory.name });
            setEditingSubCategory(null);
        } catch (err: any) {
            console.error(err);
            alert("Error al guardar: " + err.message);
        }
    };

    const filteredSubCategoriesForForm = subCategories.filter(s => s.categoryId === productFormData.categoryId);

    // --- LOGIN VIEW ---
    if (!user) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
                <div className="w-full max-w-md bg-brand-gray/30 p-8 rounded-lg border border-white/10 backdrop-blur-md">
                    <div className="text-center mb-8">
                        <div className="inline-block p-3 rounded-full bg-brand-green/10 mb-4">
                            <LogIn className="w-8 h-8 text-brand-green" />
                        </div>
                        <h2 className="text-2xl font-serif text-white">Acceso Administrativo</h2>
                        <p className="text-gray-400 text-sm mt-2">Ingresa tus credenciales para gestionar el catálogo</p>
                    </div>

                    {loginError && (
                        <div className="mb-4 p-3 bg-red-900/20 border border-red-900/50 text-red-200 text-sm rounded flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            {loginError}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 text-white p-3 rounded focus:border-brand-gold focus:outline-none transition-colors"
                                placeholder="admin@balalaikas.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider mb-2">Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 text-white p-3 rounded focus:border-brand-gold focus:outline-none transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                        <button type="submit" className="w-full bg-brand-green text-white py-3 font-bold tracking-wider uppercase hover:bg-green-700 transition-colors">
                            Entrar
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // --- DASHBOARD VIEW ---
    return (
        <div className="min-h-screen bg-brand-dark pb-20 text-gray-200 relative">

            {/* Admin Header */}
            <div className="bg-black border-b border-white/10 py-8 px-4 sticky top-0 z-30 backdrop-blur-lg bg-black/80">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-serif text-white mb-1">Gestión de Inventario</h1>
                        <p className="text-xs text-gray-500 uppercase tracking-widest">Admin: <span className="text-brand-gold">{user.email}</span></p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setActiveTab('PRODUCTS')}
                            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all ${activeTab === 'PRODUCTS' ? 'bg-brand-gold text-black' : 'border border-white/10 text-gray-400 hover:text-white'}`}
                        >
                            Productos
                        </button>
                        <button
                            onClick={() => setActiveTab('CATEGORIES')}
                            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all ${activeTab === 'CATEGORIES' ? 'bg-brand-gold text-black' : 'border border-white/10 text-gray-400 hover:text-white'}`}
                        >
                            Categorías
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pt-8">

                {/* PRODUCT TAB */}
                {activeTab === 'PRODUCTS' && (
                    <>
                        {/* Toolbar & Filters */}
                        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-end md:items-center bg-white/5 p-4 rounded border border-white/5">
                            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Buscar producto..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 pr-4 py-2 bg-black/50 border border-white/10 rounded text-sm focus:border-brand-gold outline-none text-white w-full md:w-64"
                                    />
                                </div>

                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="px-4 py-2 bg-black/50 border border-white/10 rounded text-sm focus:border-brand-gold outline-none text-white"
                                >
                                    <option value="ALL">Todos los Orígenes</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>

                                <select
                                    value={selectedSubCategory}
                                    onChange={(e) => setSelectedSubCategory(e.target.value)}
                                    disabled={selectedCategory === 'ALL'}
                                    className="px-4 py-2 bg-black/50 border border-white/10 rounded text-sm focus:border-brand-gold outline-none text-white disabled:opacity-50"
                                >
                                    <option value="ALL">Todas las Marcas</option>
                                    {availableSubCategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>

                            <button
                                onClick={openAddModal}
                                className="bg-brand-green hover:bg-green-700 text-white px-6 py-2 rounded text-xs font-bold uppercase tracking-widest flex items-center shadow-lg shadow-brand-green/20 transition-all"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Nuevo Perfume
                            </button>
                        </div>

                        {/* Products Grid (Admin View) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map(product => (
                                <div key={product.id} className={`flex flex-col bg-brand-gray/20 border rounded-lg overflow-hidden transition-all duration-300 ${product.outOfStock ? 'border-red-900/30 bg-red-900/5' : 'border-white/5 hover:border-brand-gold/30'} h-full relative`}>

                                    {/* Image Area */}
                                    <div className="h-48 w-full overflow-hidden bg-black relative flex-shrink-0">
                                        <img src={product.imageUrl} alt={product.name} className={`w-full h-full object-cover transition-opacity ${product.outOfStock ? 'opacity-50 grayscale' : 'opacity-80'}`} />
                                        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-10">
                                            {product.featured && <span className="bg-brand-gold text-black text-[10px] font-bold px-2 py-1 uppercase rounded-sm shadow-sm">Star</span>}
                                            {product.discount && product.discount > 0 && <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase rounded-sm shadow-sm">-{product.discount}%</span>}
                                            {product.outOfStock && <span className="bg-red-900 text-white text-[10px] font-bold px-2 py-1 uppercase rounded-sm shadow-sm">Agotado</span>}
                                        </div>
                                    </div>

                                    {/* Info Area */}
                                    <div className="p-4 flex flex-col flex-grow">
                                        <div className="mb-2">
                                            <div className="text-[10px] text-brand-gold font-bold uppercase tracking-wider mb-1 truncate">{product.brand}</div>
                                            <h3 className="font-serif text-white text-lg truncate" title={product.name}>{product.name}</h3>
                                            <div className={`flex flex-col ${product.outOfStock ? 'text-gray-500' : 'text-white'}`}>
                                                <span className="text-lg font-medium">
                                                    ${(product.price ?? 0).toFixed(2)}
                                                </span>
                                                {product.priceCordobas && product.priceCordobas > 0 && (
                                                    <span className="text-xs text-gray-400">C${product.priceCordobas.toFixed(2)}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-gray-500 text-xs mb-2">{categories.find(c => c.id === product.categoryId)?.name}</div>
                                        <p className="text-gray-600 text-xs line-clamp-2">{product.description}</p>
                                    </div>

                                    {/* Action Buttons - Dedicated Footer */}
                                    <div className="grid grid-cols-3 border-t border-white/10 divide-x divide-white/10 bg-black/40 mt-auto z-10 sticky bottom-0">
                                        <button
                                            type="button"
                                            onClick={() => openEditModal(product)}
                                            className="py-4 hover:bg-brand-gold hover:text-black text-gray-300 transition-colors flex flex-col items-center justify-center gap-1 group"
                                            title="Editar"
                                        >
                                            <Pencil size={18} className="group-hover:scale-110 transition-transform" />
                                            <span className="text-[9px] uppercase font-bold tracking-widest">Editar</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={(e) => toggleStock(product, e)}
                                            className={`py-4 transition-colors flex flex-col items-center justify-center gap-1 ${product.outOfStock ? 'bg-red-900/20 text-red-400 hover:bg-red-900/50' : 'hover:bg-brand-green/20 text-gray-300 hover:text-brand-green'}`}
                                            title={product.outOfStock ? "Habilitar Stock" : "Marcar Agotado"}
                                        >
                                            {product.outOfStock ? <XCircle size={18} /> : <Check size={18} />}
                                            <span className="text-[9px] uppercase font-bold tracking-widest">Stock</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={(e) => deleteProduct(product.id, e)}
                                            className="py-4 hover:bg-red-600 hover:text-white text-gray-300 transition-colors flex flex-col items-center justify-center gap-1 group"
                                            title="Eliminar"
                                        >
                                            <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
                                            <span className="text-[9px] uppercase font-bold tracking-widest">Borrar</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="text-center py-20 border border-dashed border-white/10 rounded">
                                <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-xl text-gray-400">No se encontraron productos</h3>
                                <p className="text-sm text-gray-600">Intenta cambiar los filtros o añade uno nuevo.</p>
                            </div>
                        )}
                    </>
                )}

                {/* CATEGORIES TAB */}
                {activeTab === 'CATEGORIES' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-brand-gray/10 p-8 rounded border border-white/5">
                        {/* Add Category */}
                        <div className="space-y-8">
                            <div className="bg-black/20 p-6 rounded border border-white/5">
                                <h3 className="font-bold text-brand-gold uppercase tracking-widest text-xs mb-4">1. Nueva Categoría (Origen)</h3>
                                <form onSubmit={handleCategorySubmit} className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Ej. Arabes, Italianos..."
                                        className="flex-1 bg-black/50 border border-white/10 p-2 rounded text-white focus:border-brand-gold outline-none"
                                        value={newCategoryName}
                                        onChange={e => setNewCategoryName(e.target.value)}
                                    />
                                    <button type="submit" className="bg-brand-green text-white px-4 py-2 rounded hover:bg-white hover:text-brand-black transition-colors">Agregar</button>
                                </form>
                            </div>
                            <div className="bg-black/20 p-6 rounded border border-white/5">
                                <h3 className="font-bold text-brand-gold uppercase tracking-widest text-xs mb-4">2. Nueva Subcategoría (Marca)</h3>
                                <form onSubmit={handleSubCategorySubmit} className="space-y-4">
                                    <select
                                        className="w-full bg-black/50 border border-white/10 p-2 rounded text-white focus:border-brand-gold outline-none"
                                        value={newSubCatParent}
                                        onChange={e => setNewSubCatParent(e.target.value)}
                                    >
                                        <option value="" className="bg-black">Seleccionar Origen Padre...</option>
                                        {categories.map(c => <option key={c.id} value={c.id} className="bg-black">{c.name}</option>)}
                                    </select>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Ej. Lattafa, Versace..."
                                            className="flex-1 bg-black/50 border border-white/10 p-2 rounded text-white focus:border-brand-gold outline-none"
                                            value={newSubCatName}
                                            onChange={e => setNewSubCatName(e.target.value)}
                                        />
                                        <button type="submit" className="bg-brand-green text-white px-4 py-2 rounded hover:bg-white hover:text-brand-black transition-colors">Agregar</button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* View Tree (With Edit/Delete) */}
                        <div>
                            <h3 className="font-bold text-xl text-white mb-6">Editar Estructura</h3>
                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                {categories.map(cat => (
                                    <div key={cat.id} className="border border-white/10 bg-white/5 rounded p-4">
                                        {/* Category Header */}
                                        <div className="flex items-center justify-between mb-2">
                                            {editingCategory?.id === cat.id ? (
                                                <div className="flex items-center gap-2 flex-1 mr-2">
                                                    <input
                                                        autoFocus
                                                        type="text"
                                                        value={editingCategory.name}
                                                        onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                                        className="bg-black border border-brand-gold/50 text-white text-sm px-2 py-1 rounded w-full"
                                                    />
                                                    <button onClick={saveCategoryEdit} className="text-green-500"><Save size={16} /></button>
                                                    <button onClick={() => setEditingCategory(null)} className="text-red-500"><XSquare size={16} /></button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 font-bold text-white">
                                                    <Tag className="w-4 h-4 text-brand-gold" />
                                                    {cat.name}
                                                </div>
                                            )}

                                            {editingCategory?.id !== cat.id && (
                                                <div className="flex items-center gap-2">
                                                    <button type="button" onClick={() => setEditingCategory({ id: cat.id, name: cat.name })} className="text-gray-500 hover:text-brand-gold p-2"><Pencil size={16} /></button>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => deleteCategory(cat.id, e)}
                                                        className="text-gray-500 hover:text-red-500 hover:bg-red-900/20 p-2 rounded transition-colors z-10"
                                                        title="Eliminar Categoría"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Subcategories List */}
                                        <div className="pl-6 space-y-2 border-l-2 border-white/5 ml-2">
                                            {subCategories.filter(s => s.categoryId === cat.id).length === 0 && (
                                                <span className="text-xs text-gray-500 italic block py-1 pl-4">Sin marcas registradas</span>
                                            )}
                                            {subCategories.filter(s => s.categoryId === cat.id).map(sub => (
                                                <div key={sub.id} className="text-sm text-gray-400 flex items-center justify-between group pl-4 py-1 hover:bg-white/5 rounded">
                                                    {editingSubCategory?.id === sub.id ? (
                                                        <div className="flex items-center gap-2 flex-1 mr-2">
                                                            <input
                                                                autoFocus
                                                                type="text"
                                                                value={editingSubCategory.name}
                                                                onChange={(e) => setEditingSubCategory({ ...editingSubCategory, name: e.target.value })}
                                                                className="bg-black border border-brand-gold/50 text-white text-xs px-2 py-1 rounded w-full"
                                                            />
                                                            <button onClick={saveSubCategoryEdit} className="text-green-500"><Save size={14} /></button>
                                                            <button onClick={() => setEditingSubCategory(null)} className="text-red-500"><XSquare size={14} /></button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-1 h-1 bg-brand-green rounded-full"></div>
                                                            {sub.name}
                                                        </div>
                                                    )}

                                                    {editingSubCategory?.id !== sub.id && (
                                                        <div className="flex items-center gap-1">
                                                            <button type="button" onClick={() => setEditingSubCategory({ id: sub.id, name: sub.name })} className="text-gray-600 hover:text-brand-gold p-1.5"><Pencil size={14} /></button>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => deleteSubCategory(sub.id, e)}
                                                                className="text-gray-600 hover:text-red-500 hover:bg-red-900/20 p-1.5 rounded transition-colors z-10"
                                                                title="Eliminar Subcategoría"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ADD/EDIT PRODUCT MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-brand-dark border border-white/10 w-full max-w-2xl rounded-lg shadow-2xl flex flex-col max-h-[90vh]">

                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-black/40">
                            <h3 className="font-bold text-xl text-white flex items-center">
                                {editingProductId ? (
                                    <Pencil className="w-5 h-5 mr-2 text-brand-gold" />
                                ) : (
                                    <Plus className="w-5 h-5 mr-2 text-brand-gold" />
                                )}
                                {editingProductId ? 'Editar Perfume' : 'Nuevo Perfume'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white p-2 rounded hover:bg-white/10 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body (Scrollable) */}
                        <div className="p-8 overflow-y-auto custom-scrollbar">
                            <form id="productForm" onSubmit={handleProductSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Nombre</label>
                                    <input required type="text" className="w-full bg-black/40 border border-white/10 p-3 rounded text-white focus:border-brand-gold outline-none transition-colors" value={productFormData.name || ''} onChange={e => setProductFormData({ ...productFormData, name: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Precio (USD)</label>
                                        <input required type="number" min="0" step="0.01" className="w-full bg-black/40 border border-white/10 p-3 rounded text-white focus:border-brand-gold outline-none transition-colors" value={productFormData.price ?? ''} onChange={e => setProductFormData({ ...productFormData, price: e.target.value === '' ? null : Math.max(0, parseFloat(e.target.value)) })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Precio (NIO)</label>
                                        <input type="number" min="0" step="0.01" className="w-full bg-black/40 border border-white/10 p-3 rounded text-white focus:border-brand-gold outline-none transition-colors" value={productFormData.priceCordobas ?? ''} onChange={e => setProductFormData({ ...productFormData, priceCordobas: e.target.value === '' ? null : Math.max(0, parseFloat(e.target.value)) })} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Descuento (%)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="1"
                                        placeholder="Ej: 15 para 15% de descuento"
                                        className="w-full bg-black/40 border border-white/10 p-3 rounded text-white focus:border-brand-gold outline-none transition-colors"
                                        value={productFormData.discount ?? 0}
                                        onChange={e => setProductFormData({ ...productFormData, discount: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                                    />
                                    {productFormData.discount && productFormData.discount > 0 && productFormData.price && (
                                        <p className="text-xs text-brand-gold mt-2">
                                            Precio con descuento: ${(productFormData.price * (1 - productFormData.discount / 100)).toFixed(2)}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Categoría (Origen)</label>
                                        <select required className="w-full bg-black/40 border border-white/10 p-3 rounded text-white focus:border-brand-gold outline-none transition-colors" value={productFormData.categoryId} onChange={e => setProductFormData({ ...productFormData, categoryId: e.target.value, subCategoryId: '' })}>
                                            <option value="" className="bg-black">Seleccionar...</option>
                                            {categories.map(c => <option key={c.id} value={c.id} className="bg-black">{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Marca (Subcategoría)</label>
                                        <select disabled={!productFormData.categoryId} className="w-full bg-black/40 border border-white/10 p-3 rounded text-white focus:border-brand-gold outline-none disabled:opacity-50 transition-colors" value={productFormData.subCategoryId} onChange={e => setProductFormData({ ...productFormData, subCategoryId: e.target.value })}>
                                            <option value="" className="bg-black">Seleccionar...</option>
                                            {filteredSubCategoriesForForm.map(s => <option key={s.id} value={s.id} className="bg-black">{s.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Imagen</label>
                                    <div className="flex items-start gap-4">
                                        <label className="flex-1 cursor-pointer bg-brand-gray/30 hover:bg-brand-gray/50 border border-dashed border-white/20 hover:border-brand-gold text-gray-300 text-sm py-10 px-4 rounded flex flex-col items-center justify-center transition-all group">
                                            <Upload className="w-8 h-8 mb-3 text-brand-gold group-hover:scale-110 transition-transform" />
                                            <span className="font-medium">{imagePreview ? 'Cambiar foto' : 'Subir foto'}</span>
                                            <span className="text-xs text-gray-500 mt-2">Max 800px (Auto-resize)</span>
                                            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                        </label>
                                        {imagePreview && (
                                            <div className="h-32 w-32 flex-shrink-0 rounded border border-white/10 overflow-hidden bg-black">
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Descripción</label>
                                    <textarea className="w-full bg-black/40 border border-white/10 p-3 rounded text-white focus:border-brand-gold outline-none transition-colors" rows={4} value={productFormData.description} onChange={e => setProductFormData({ ...productFormData, description: e.target.value })}></textarea>
                                </div>

                                <div className="flex gap-8 pt-2 border-t border-white/5">
                                    <div className="flex items-center">
                                        <input type="checkbox" id="featured" className="mr-3 accent-brand-gold h-5 w-5 cursor-pointer" checked={!!productFormData.featured} onChange={e => setProductFormData({ ...productFormData, featured: e.target.checked })} />
                                        <label htmlFor="featured" className="text-sm text-gray-300 font-medium cursor-pointer hover:text-brand-gold transition-colors">Destacado (Star)</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input type="checkbox" id="outofstock" className="mr-3 accent-red-500 h-5 w-5 cursor-pointer" checked={!!productFormData.outOfStock} onChange={e => setProductFormData({ ...productFormData, outOfStock: e.target.checked })} />
                                        <label htmlFor="outofstock" className="text-sm text-red-300 font-medium cursor-pointer hover:text-red-200 transition-colors">Agotado (Sin Stock)</label>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-white/10 bg-black/40 flex justify-end gap-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-3 rounded-sm text-gray-400 hover:text-white text-xs uppercase font-bold tracking-widest transition-colors border border-transparent hover:border-white/10"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                form="productForm"
                                className="bg-brand-gold text-black px-8 py-3 rounded-sm hover:bg-white transition-colors font-bold uppercase tracking-widest shadow-lg shadow-brand-gold/10 hover:shadow-brand-gold/30"
                            >
                                {editingProductId ? 'Actualizar' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminDashboard;
