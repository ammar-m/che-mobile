/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  ShoppingCart, 
  User, 
  MapPin, 
  Menu, 
  X, 
  ChevronRight, 
  Package, 
  Filter,
  CreditCard,
  History,
  Globe,
  Sparkles,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from './lib/firebase';
import './i18n';

// Constants
const API_URL = ''; // Relative in dev/prod with proxy

// Components
const SmartSearch = ({ onFound }: { onFound: (partIds: string[]) => void }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSmartSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      // In a real app, this would call a backend route that uses Gemini
      // to analyze the car problem and return relevant part IDs/categories.
      console.log('AI analyzing problem:', query);
      setTimeout(() => {
        setIsSearching(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      setIsSearching(false);
    }
  };

  return (
    <div className="relative px-4 mt-4">
      <div className="relative">
        <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSmartSearch()}
          placeholder="Ask AI: 'My brakes are squeaking'..."
          className="w-full bg-blue-50 border-blue-100 border rounded-2xl py-4 pl-12 pr-12 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
        />
        {isSearching ? (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-blue-500" size={18} />
        ) : (
          <button 
            onClick={handleSmartSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 hover:scale-110 transition-transform"
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
const MobileNavbar = ({ 
  isRtl, 
  onToggleLang, 
  cartCount,
  onNavigate 
}: { 
  isRtl: boolean, 
  onToggleLang: () => void, 
  cartCount: number,
  onNavigate: (view: string) => void
}) => {
  const { t } = useTranslation();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 shadow-lg pb-safe">
      <button onClick={() => onNavigate('home')} className="flex flex-col items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors">
        <Package size={20} />
        <span className="text-[10px] font-medium uppercase tracking-wider">{t('categories')}</span>
      </button>
      <button onClick={() => onNavigate('track')} className="flex flex-col items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors">
        <MapPin size={20} />
        <span className="text-[10px] font-medium uppercase tracking-wider">{t('track_order')}</span>
      </button>
      <div className="relative -mt-10">
        <button 
          onClick={() => onNavigate('cart')}
          className="bg-blue-600 text-white p-4 rounded-full shadow-xl shadow-blue-200 active:scale-95 transition-transform"
        >
          <ShoppingCart size={24} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>
      <button onClick={() => onNavigate('history')} className="flex flex-col items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors">
        <History size={20} />
        <span className="text-[10px] font-medium uppercase tracking-wider">{t('order_history')}</span>
      </button>
      <button onClick={onToggleLang} className="flex flex-col items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors">
        <Globe size={20} />
        <span className="text-[10px] font-medium uppercase tracking-wider">{isRtl ? 'EN' : 'AR'}</span>
      </button>
    </nav>
  );
};

const SearchBar = () => {
  const { t } = useTranslation();
  return (
    <div className="relative px-4 mt-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder={t('search_placeholder')}
          className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
        />
      </div>
    </div>
  );
};

interface Part {
  id: string;
  name: string;
  name_ar: string;
  price: number;
  image: string;
  brand: string;
  category: string;
}

const PartCard = ({ part, isRtl, onAddToCart }: { part: Part, isRtl: boolean, onAddToCart: (p: Part) => void }) => {
  const { t } = useTranslation();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-4 shadow-sm border border-gray-50 group active:scale-[0.98] transition-transform"
    >
      <div className="aspect-square rounded-2xl bg-gray-100 mb-4 overflow-hidden relative">
        <img 
          src={part.image} 
          alt={part.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold text-gray-600 shadow-sm uppercase tracking-tight">
          {part.brand}
        </div>
      </div>
      <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1">
        {isRtl ? part.name_ar : part.name}
      </h3>
      <p className="text-xs text-gray-400 mb-3 uppercase tracking-tight">{part.category}</p>
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 uppercase font-medium leading-none mb-0.5">{t('price')}</span>
          <span className="font-bold text-blue-600">${part.price}</span>
        </div>
        <button 
          onClick={() => onAddToCart(part)}
          className="bg-gray-900 text-white p-2.5 rounded-xl hover:bg-blue-600 transition-colors shadow-lg active:scale-90"
        >
          <ShoppingCart size={18} />
        </button>
      </div>
    </motion.div>
  );
};

const TrackOrder = () => {
  const { t } = useTranslation();
  const [trackingId, setTrackingId] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const handleTrack = () => {
    // Mock status for now
    if (trackingId.length > 5) {
      setStatus('shipped');
    }
  };

  return (
    <div className="px-6 py-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('track_order')}</h2>
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <Package className="text-blue-600 mb-4" size={48} strokeWidth={1.5} />
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
          {t('tracking_number')}
        </label>
        <div className="flex gap-2">
          <input 
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            className="flex-1 bg-gray-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500/20"
            placeholder="CHE-123456"
          />
          <button 
            onClick={handleTrack}
            className="bg-blue-600 text-white px-6 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 active:scale-95 transition-transform"
          >
            Track
          </button>
        </div>

        <AnimatePresence>
          {status && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-8 border-t border-dashed pt-6"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <CreditCard size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('order_status')}</p>
                  <p className="font-bold text-gray-900 capitalize italic">{status}</p>
                </div>
              </div>
              <div className="space-y-6 relative ml-6 before:absolute before:left-[-1.5px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100">
                <div className="relative">
                  <div className="absolute -left-[27.5px] top-1 w-3 h-3 rounded-full bg-blue-600 border-2 border-white" />
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Delivered</p>
                  <p className="text-xs text-gray-500">Expected: May 15, 2026</p>
                </div>
                <div className="relative opacity-40">
                  <div className="absolute -left-[27.5px] top-1 w-3 h-3 rounded-full bg-gray-200 border-2 border-white" />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Shipped</p>
                  <p className="text-xs text-gray-500">Left warehouse: May 12, 2026</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const CartView = ({ items, onRemove, onCheckout }: { items: Part[], onRemove: (id: string) => void, onCheckout: () => void }) => {
  const { t } = useTranslation();
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="px-6 py-4 pb-32">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('cart')}</h2>
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="bg-gray-50 rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
            <Package className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-400 font-medium">Your cart is empty</p>
          </div>
        ) : (
          items.map((item, idx) => (
            <motion.div 
              layout
              key={item.id + idx}
              className="bg-white rounded-3xl p-4 flex gap-4 shadow-sm border border-gray-50"
            >
              <img src={item.image} className="w-20 h-20 rounded-2xl object-cover bg-gray-100" referrerPolicy="no-referrer" />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{item.name}</h3>
                <p className="text-xs text-gray-400">{item.brand}</p>
                <div className="flex justify-between items-end mt-2">
                  <span className="font-bold text-blue-600">${item.price}</span>
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="text-red-500 text-xs font-bold uppercase tracking-widest px-3 py-1 bg-red-50 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-24 left-6 right-6 bg-gray-900 rounded-3xl p-6 shadow-2xl text-white flex justify-between items-center z-40"
        >
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
            <p className="text-2xl font-bold">${total.toFixed(2)}</p>
          </div>
          <button 
            onClick={onCheckout}
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-blue-500/20 active:scale-95 transition-transform flex items-center gap-2"
          >
            {t('checkout')}
            <ChevronRight size={18} />
          </button>
        </motion.div>
      )}
    </div>
  );
};

const SAMPLE_PARTS: Part[] = [
  { id: '1', name: 'Performance Brake Pads', name_ar: 'وسادات الفرامل عالية الأداء', price: 120, image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80', brand: 'Brembo', category: 'Brakes' },
  { id: '2', name: 'High-Flow Air Filter', name_ar: 'فلتر هواء عالي التدفق', price: 45, image: 'https://images.unsplash.com/photo-1597404294360-feed99066606?w=800&q=80', brand: 'K&N', category: 'Engine' },
  { id: '3', name: 'LED Headlight Set', name_ar: 'مجموعة مصابيح LED', price: 210, image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80', brand: 'Philips', category: 'Lighting' },
  { id: '4', name: 'Castrol Edge 5W-30', name_ar: 'زيت كاسترول 5W-30', price: 65, image: 'https://images.unsplash.com/photo-1620939514449-6dc9b7ae2910?w=800&q=80', brand: 'Castrol', category: 'Fluids' },
];

export default function App() {
  const { i18n, t } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [currentView, setCurrentView] = useState('home');
  const [cart, setCart] = useState<Part[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [isRtl, i18n.language]);

  useEffect(() => {
    // Real-time Firestore fetching
    const q = query(collection(db, 'parts'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const partsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        image: doc.data().imageUrl // Map field naming
      })) as Part[];
      setParts(partsData.length > 0 ? partsData : SAMPLE_PARTS);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  const addToCart = (part: Part) => {
    setCart((prev) => [...prev, part]);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter(item => item.id !== id));
  };

  const handleCheckout = async () => {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total * 100 }) // Cents
      });
      const data = await response.json();
      alert(`Checkout session started: ${data.message}\nSecret: ${data.clientSecret}`);
      // In a real app, you'd navigate to Stripe Checkout or local Stripe UI
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`min-h-screen bg-[#FDFDFD] font-sans pb-24 ${isRtl ? 'font-serif' : ''}`}>
      {/* Header */}
      <header className="px-6 pt-12 flex justify-between items-center group">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
            {t('app_name').split(' ')[0]}
            <span className="text-blue-600 block not-italic -mt-1">{t('app_name').split(' ').slice(1).join(' ')}</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
              AM
            </div>
          </div>
        </div>
      </header>

      <main>
        {currentView === 'home' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <SmartSearch onFound={() => {}} />
            <SearchBar />
            
            {/* Categories */}
            <div className="px-6 mt-8 overflow-x-auto">
              <div className="flex gap-3 pb-2 no-scrollbar">
                {['All', 'Brakes', 'Engine', 'Lighting', 'Fluids'].map((cat) => (
                  <button 
                    key={cat}
                    className={`px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                      cat === 'All' ? 'bg-gray-900 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Section */}
            <section className="px-6 mt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">{t('featured_parts')}</h2>
                <button className="text-blue-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 group">
                  See All <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
              {loading ? (
                <div className="grid grid-cols-2 gap-4">
                  {[1,2,3,4].map(n => (
                    <div key={n} className="aspect-square rounded-3xl bg-gray-100 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {parts.map((part) => (
                    <PartCard key={part.id} part={part} isRtl={isRtl} onAddToCart={addToCart} />
                  ))}
                </div>
              )}
            </section>

            {/* Banner Section */}
            <section className="px-6 mt-10">
              <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
                <div className="relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 block mb-2 underline decoration-2 underline-offset-4">Limited Offer</span>
                  <h3 className="text-3xl font-black italic leading-none mb-4 uppercase">Expert<br />Support</h3>
                  <button className="bg-white text-blue-600 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider active:scale-95 transition-transform">
                    Talk to Expert
                  </button>
                </div>
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10 rotate-12 scale-150">
                  <Package size={200} />
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {currentView === 'track' && <TrackOrder />}
        {currentView === 'cart' && <CartView items={cart} onRemove={removeFromCart} onCheckout={handleCheckout} />}
        {currentView === 'history' && (
          <div className="px-6 py-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('order_history')}</h2>
            <div className="bg-gray-50 rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
              <History className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-400 font-medium">No previous orders found</p>
            </div>
          </div>
        )}
      </main>

      <MobileNavbar 
        isRtl={isRtl} 
        onToggleLang={toggleLanguage} 
        cartCount={cart.length} 
        onNavigate={setCurrentView}
      />
    </div>
  );
}
