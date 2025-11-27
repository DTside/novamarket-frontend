'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { useCart } from '../../../context/CartContext';
import toast from 'react-hot-toast';
import { Check, Star } from 'lucide-react';

const COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Blue', hex: '#2563eb' }
];

export default function ProductPage({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(COLORS[0].name);
  
  // НОВОЕ: Активная картинка для слайдера
  const [activeImage, setActiveImage] = useState('');

  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`https://novamarket-backend-6fi6.onrender.com/api/products/${id}`)
      .then(res => res.json())
      .then(data => { 
          setProduct(data); 
          // Ставим первую картинку из галереи или основную
          setActiveImage(data.gallery && data.gallery.length > 0 ? data.gallery[0] : data.image_url);
          setLoading(false); 
      })
      .catch(err => console.error(err));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div></div>;
  if (!product) return <div className="text-center py-20">Товар не найден</div>;

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-white/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          
          {/* --- ЛЕВАЯ ЧАСТЬ: ГАЛЕРЕЯ --- */}
          <div className="p-10 flex flex-col items-center bg-white/50">
             {/* Главное большое фото */}
             <div className="relative w-full h-[400px] mb-6">
                <Image 
                    src={activeImage} 
                    alt={product.title} 
                    fill 
                    className="object-contain drop-shadow-2xl transition-all duration-500 ease-in-out" 
                />
             </div>

             {/* Миниатюры (Слайдер) */}
             {product.gallery && product.gallery.length > 1 && (
                 <div className="flex gap-4 overflow-x-auto py-2 px-2 w-full justify-center">
                    {product.gallery.map((img, index) => (
                        <button 
                            key={index}
                            onClick={() => setActiveImage(img)}
                            className={`relative w-20 h-20 rounded-xl border-2 overflow-hidden flex-shrink-0 transition-all ${
                                activeImage === img ? 'border-purple-600 ring-2 ring-purple-100 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                        >
                            <Image src={img} alt="thumb" fill className="object-cover" />
                        </button>
                    ))}
                 </div>
             )}
          </div>

          {/* --- ПРАВАЯ ЧАСТЬ: ИНФО --- */}
          <div className="p-8 md:p-12 flex flex-col">
            <div className="mb-auto">
                <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                  {product.category}
                </span>
                <h1 className="text-4xl font-black text-gray-900 mb-4 leading-tight">{product.title}</h1>
                
                <div className="flex items-center gap-2 mb-6">
                    <div className="flex text-yellow-400"><Star size={18} fill="currentColor"/><Star size={18} fill="currentColor"/><Star size={18} fill="currentColor"/><Star size={18} fill="currentColor"/><Star size={18} fill="currentColor"/></div>
                    <span className="text-sm text-gray-500">(128 отзывов)</span>
                </div>

                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  {product.description}
                </p>

                <div className="mb-8">
                    <span className="text-sm font-bold text-gray-700 block mb-3">Цвет: {selectedColor}</span>
                    <div className="flex gap-3">
                        {COLORS.map((color) => (
                            <button
                                key={color.name}
                                onClick={() => setSelectedColor(color.name)}
                                className={`w-10 h-10 rounded-full border-2 transition-all transform hover:scale-110 ${
                                    selectedColor === color.name ? 'border-purple-600 ring-2 ring-purple-200' : 'border-transparent'
                                }`}
                                style={{ backgroundColor: color.hex }}
                            />
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8 bg-white/50 p-4 rounded-xl border border-white/60">
                    <div><span className="text-gray-400 text-xs block">Гарантия</span><span className="font-medium">12 месяцев</span></div>
                    <div><span className="text-gray-400 text-xs block">Доставка</span><span className="font-medium">Завтра</span></div>
                </div>
            </div>

            <div className="border-t border-gray-200 pt-8 flex items-center justify-between gap-6">
              <div>
                <span className="text-4xl font-black text-gray-900">{product.price} ₴</span>
                <span className="block text-green-600 text-sm font-medium flex items-center gap-1 mt-1">
                    <Check size={14} /> В наличии
                </span>
              </div>
              
              <button 
                onClick={() => {
                    addToCart({ ...product, selectedColor });
                    toast.success(`Добавлено: ${selectedColor}`);
                }}
                className="flex-grow bg-black text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-purple-600 transition shadow-xl active:scale-95"
              >
                В корзину
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}