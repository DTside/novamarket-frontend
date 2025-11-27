'use client';

import { useCart } from '../../context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PaymentModal from '../../components/PaymentModal';
import toast from 'react-hot-toast';
import { Tag } from 'lucide-react';
import AnimatedPrice from '../../components/AnimatedPrice'; // <--- Импорт анимации

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, rawTotal, discount, discountAmount, applyCoupon } = useCart();
  const router = useRouter();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [promoInput, setPromoInput] = useState('');

  const handleCheckoutClick = () => {
    const userString = localStorage.getItem('user');
    if (!userString) {
      toast.error("Войдите, чтобы оформить заказ!");
      router.push('/login');
      return;
    }
    setIsPaymentOpen(true);
  };

  const handleApplyPromo = async () => {
    if (!promoInput) return;
    try {
        const res = await fetch('http://localhost:5000/coupons/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: promoInput })
        });
        const data = await res.json();

        if (!res.ok) {
            toast.error(data.message);
            return;
        }

        applyCoupon(data.code, data.discount_percent);
        toast.success(`Скидка ${data.discount_percent}% применена! 🔥`);
    } catch (err) {
        toast.error("Ошибка сети");
    }
  };

  const handlePaymentSuccess = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    try {
      const res = await fetch('http://localhost:5000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          items: cart,
          total_price: totalPrice
        }),
      });

      if (!res.ok) throw new Error('Ошибка при сохранении заказа');

      setIsPaymentOpen(false);
      localStorage.removeItem('novaCart');
      
      toast.success("Оплата успешна! Заказ создан. 🎉");
      
      setTimeout(() => {
          window.location.href = '/profile';
      }, 1000);

    } catch (err) {
      console.error(err);
      toast.error("Ошибка сохранения заказа (но оплата прошла)");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Корзина пуста 😔</h2>
        <Link href="/" className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition">
          Вернуться к покупкам
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Моя корзина</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Список товаров */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <div key={`${item.id}-${item.selectedColor}-${index}`} className="bg-white p-4 rounded-2xl shadow-sm flex gap-4 items-center">
                <div className="relative w-24 h-24 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
                  <Image src={item.image_url} alt={item.title} fill className="object-contain p-2" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-gray-800">{item.title}</h3>
                  <p className="text-xs text-purple-600 font-bold uppercase mb-1">
                    Цвет: {item.selectedColor}
                  </p>
                  <p className="text-gray-500 text-sm">{item.price} ₴</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => updateQuantity(item.id, item.selectedColor, -1)} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200">-</button>
                  <span className="font-medium w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.selectedColor, 1)} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200">+</button>
                </div>
                <button onClick={() => removeFromCart(item.id, item.selectedColor)} className="text-gray-400 hover:text-red-500 p-2">✕</button>
              </div>
            ))}
          </div>

          {/* Правая колонка */}
          <div className="h-fit space-y-6">
            
            {/* Промокод */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
                <label className="text-sm font-bold text-gray-700 mb-2 block flex items-center gap-2">
                    <Tag size={16} /> Промокод
                </label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        placeholder="NOVA2025" 
                        className="flex-grow border bg-gray-50 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500 uppercase"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                    />
                    <button 
                        onClick={handleApplyPromo}
                        className="bg-black text-white px-4 rounded-xl font-bold hover:bg-gray-800 transition"
                    >
                        OK
                    </button>
                </div>
            </div>

            {/* Итого с АНИМАЦИЕЙ */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex justify-between mb-2 text-gray-600">
                <span>Товары ({cart.length})</span>
                {/* Анимация суммы без скидки */}
                <span className="font-bold text-gray-900">
                    <AnimatedPrice value={rawTotal} />
                </span>
              </div>
              
              {discount > 0 && (
                  <div className="flex justify-between mb-2 text-green-600 font-medium">
                    <span>Скидка {discount}%</span>
                    {/* Анимация суммы скидки */}
                    <span className="flex">
                        - <AnimatedPrice value={discountAmount} />
                    </span>
                  </div>
              )}

              <div className="flex justify-between mb-6 text-gray-600">
                <span>Доставка</span>
                <span className="text-green-600">Бесплатно</span>
              </div>
              
              <div className="border-t pt-4 flex justify-between items-end text-gray-900 mb-6">
                <span className="text-lg font-bold">Итого</span>
                {/* ГЛАВНАЯ АНИМАЦИЯ */}
                <span className="text-3xl font-black text-purple-600">
                    <AnimatedPrice value={totalPrice} />
                </span>
              </div>
              
              <button 
                onClick={handleCheckoutClick}
                className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition shadow-lg shadow-purple-200 active:scale-95"
              >
                Оформить заказ
              </button>
            </div>
          </div>

        </div>
      </div>

      {isPaymentOpen && (
        <PaymentModal 
          amount={totalPrice} 
          onClose={() => setIsPaymentOpen(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

    </div>
  );
}