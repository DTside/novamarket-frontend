import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* 1. Лого и описание */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
               <span className="text-2xl font-black text-gray-900 tracking-tighter">
                 Nova<span className="text-purple-600">Market</span>.
               </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Мы продаем технику будущего уже сегодня. Гарантия качества, быстрая доставка и лучший сервис в Украине.
            </p>
          </div>

          {/* 2. Навигация по магазину */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Магазин</h3>
            <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/" className="hover:text-purple-600 transition">Главная</Link></li>
                <li><Link href="/electronics" className="hover:text-purple-600 transition">Электроника</Link></li>
                <li><Link href="/cart" className="hover:text-purple-600 transition">Корзина</Link></li>
                <li><Link href="/profile" className="hover:text-purple-600 transition">Личный кабинет</Link></li>
            </ul>
          </div>

          {/* 3. Помощь (Новые страницы) */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Помощь</h3>
            <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/delivery" className="hover:text-purple-600 transition">Доставка и оплата</Link></li>
                <li><Link href="/warranty" className="hover:text-purple-600 transition">Гарантия и возврат</Link></li>
                <li><Link href="/contacts" className="hover:text-purple-600 transition">Контакты</Link></li>
                <li><Link href="/faq" className="hover:text-purple-600 transition">FAQ (Вопросы)</Link></li>
            </ul>
          </div>

          {/* 4. Контакты */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Контакты</h3>
            <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                    <Phone size={16} className="text-purple-600" />
                    <span>+38 (044) 123-45-67</span>
                </li>
                <li className="flex items-center gap-2">
                    <Mail size={16} className="text-purple-600" />
                    <span>support@novamarket.com</span>
                </li>
                <li className="flex items-center gap-2">
                    <MapPin size={16} className="text-purple-600" />
                    <span>Киев, ул. Крещатик, 1</span>
                </li>
            </ul>
            <div className="flex gap-4 mt-6">
                <a href="#" className="bg-gray-100 p-2 rounded-full hover:bg-purple-100 hover:text-purple-600 transition"><Instagram size={20} /></a>
                <a href="#" className="bg-gray-100 p-2 rounded-full hover:bg-purple-100 hover:text-purple-600 transition"><Facebook size={20} /></a>
                <a href="#" className="bg-gray-100 p-2 rounded-full hover:bg-purple-100 hover:text-purple-600 transition"><Twitter size={20} /></a>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">© 2025 NovaMarket. Все права защищены.</p>
            <div className="flex gap-6 text-gray-400 text-sm">
                <a href="#" className="hover:text-gray-600">Конфиденциальность</a>
                <a href="#" className="hover:text-gray-600">Условия использования</a>
            </div>
        </div>
      </div>
    </footer>
  );
}