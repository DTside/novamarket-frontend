'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Search, ShoppingBag } from 'lucide-react';
import FavoriteBtn from '../components/FavoriteBtn'; // Импорт сердечка

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('default');
  const { addToCart } = useCart();

  const fetchProducts = () => {
    setLoading(true);
    const url = new URL('https://novamarket-backend-6fi6.onrender.com/api/products');
    if (search) url.searchParams.append('search', search);
    if (category !== 'all') url.searchParams.append('category', category);
    if (sort !== 'default') url.searchParams.append('sort', sort);

    fetch(url, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    const timeout = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timeout);
  }, [search, category, sort]);

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
                <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-2">Каталог.</h1>
                <p className="text-gray-500 text-lg">Техника, которая вдохновляет.</p>
            </div>
            <div className="flex flex-wrap gap-3 w-full md:w-auto bg-white/50 backdrop-blur-md p-2 rounded-2xl border border-white/60 shadow-sm">
                <div className="flex items-center px-3 bg-white/60 rounded-xl flex-grow md:flex-grow-0">
                    <Search className="text-gray-400 w-5 h-5" />
                    <input type="text" placeholder="Поиск..." className="bg-transparent border-none p-2 outline-none text-sm w-full placeholder-gray-500" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <select className="bg-white/60 text-sm font-medium p-2.5 rounded-xl outline-none cursor-pointer hover:bg-white transition" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="all">Все категории</option>
                    <option value="smartphones">Смартфоны</option>
                    <option value="laptops">Ноутбуки</option>
                    <option value="audio">Аудио</option>
                    <option value="smartwatches">Часы</option>
                </select>
                <select className="bg-white/60 text-sm font-medium p-2.5 rounded-xl outline-none cursor-pointer hover:bg-white transition" value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="default">Популярное</option>
                    <option value="asc">Дешевле</option>
                    <option value="desc">Дороже</option>
                </select>
            </div>
        </div>

        {loading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
               {[1,2,3,4].map(i => <div key={i} className="h-96 bg-gray-200/50 rounded-3xl animate-pulse"></div>)}
           </div>
        ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-400 text-xl">Ничего не найдено</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-3xl p-4 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group flex flex-col relative"
              >
                
                {/* СЕРДЕЧКО ЗДЕСЬ */}
                <div className="absolute top-6 right-6 z-20">
                    <FavoriteBtn productId={product.id} />
                </div>

                <Link href={`/product/${product.id}`} className="cursor-pointer block relative h-64 mb-4 bg-white/50 rounded-2xl overflow-hidden shadow-inner">
                    <Image 
                        src={product.image_url} 
                        alt={product.title} 
                        fill 
                        className="object-contain p-6 group-hover:scale-110 transition duration-500" 
                    />
                </Link>

                <div className="flex flex-col flex-grow px-2">
                  <Link href={`/product/${product.id}`}>
                      <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 group-hover:text-purple-600 transition">
                        {product.title}
                      </h3>
                  </Link>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-grow font-medium">
                      {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200/30">
                    <span className="text-xl font-black text-gray-900">
                        {new Intl.NumberFormat('ru-RU').format(product.price)} <span className="text-sm text-gray-500">₴</span>
                    </span>
                    <button 
                      onClick={() => { addToCart(product); toast.success('Добавлено!'); }} 
                      className="bg-black text-white p-3 rounded-xl hover:bg-purple-600 transition active:scale-90 shadow-lg"
                    >
                      <ShoppingBag size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}