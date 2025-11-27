'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
// Импортируем красивые иконки
import { ShoppingCart, User, LogOut, Settings, LogIn } from 'lucide-react';

export default function Header() {
  const { cartCount } = useCart();
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { t } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
    window.location.href = '/'; 
  };

  return (
    // Добавили backdrop-blur для эффекта стекла
    <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-2 group">
           {/* Логотип текстом, но стильный */}
           <span className="text-2xl font-black text-gray-900 tracking-tighter group-hover:text-purple-600 transition">
             Nova<span className="text-purple-600">Market</span>.
           </span>
        </Link>

        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-black transition uppercase tracking-wide">{t('home')}</Link>
            {/* Исправленная ссылка: ведет на страницу категории */}
            <Link href="/electronics" className="hover:text-black transition uppercase tracking-wide">{t('electronics')}</Link>
        </nav>

        <div className="flex items-center gap-6">
            
            {/* Языки - сделаем аккуратнее */}
            <div className="flex gap-2 text-xs font-bold text-gray-400">
                <button onClick={() => changeLanguage('ua')} className="hover:text-black transition">UA</button>
                <button onClick={() => changeLanguage('en')} className="hover:text-black transition">EN</button>
                <button onClick={() => changeLanguage('ru')} className="hover:text-black transition">RU</button>
            </div>

            <Link href="/cart" className="relative group">
                <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-purple-600 transition" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                      {cartCount}
                  </span>
                )}
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                {user.role === 'admin' && (
                  <Link href="/admin" className="flex items-center gap-1 bg-gray-900 text-white px-3 py-1.5 rounded-full text-xs font-bold hover:bg-gray-700 transition">
                    <Settings size={14} /> 
                    <span>{t('admin')}</span>
                  </Link>
                )}

                <Link href="/profile" className="flex items-center gap-2 font-medium text-gray-700 hover:text-purple-600 transition text-sm">
                  <User size={18} />
                  <span className="hidden sm:block">{user.full_name?.split(' ')[0]}</span>
                </Link>
                
                <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link href="/login" className="flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-purple-600 transition">
                  <LogIn size={18} />
                  {t('login')}
              </Link>
            )}
        </div>
      </div>
    </header>
  );
}