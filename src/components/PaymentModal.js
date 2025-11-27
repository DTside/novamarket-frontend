'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// ТВОЙ ПУБЛИЧНЫЙ КЛЮЧ
const stripePromise = loadStripe('pk_test_51SWuEWPAxzOBm6WzJxAR4qrnlJKT8eSeEjmYG6584qLwoff4ZaK8vNQdVq6F1Yu5nZFlhAGnOCkNHyYYdxuCymBd00CXdnd6lB'); 

function CheckoutForm({ amount, onSuccess, onClose }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Подтверждаем оплату
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://localhost:3000/profile',
        
        // ПЕРЕДАЕМ ВСЕ ДАННЫЕ ВРУЧНУЮ, ЧТОБЫ STRIPE НЕ РУГАЛСЯ
        payment_method_data: {
            billing_details: {
                name: user.full_name || 'Guest User',
                email: user.email || 'guest@example.com',
                phone: '5555555555',
                address: {
                    country: 'US',
                    line1: '123 Test St',
                    city: 'New York',
                    state: 'NY',
                    postal_code: '10001', // <--- ВОТ ТО, ЧЕГО НЕ ХВАТАЛО!
                }
            }
        }
      },
      redirect: "if_required"
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement 
        options={{
          layout: "tabs",
          // ОТКЛЮЧАЕМ СИСТЕМУ LINK (чтобы не просил сохранить данные)
          wallets: {
             applePay: 'never',
             googlePay: 'never'
          },
          fields: {
            billingDetails: {
              name: 'never', 
              email: 'never', 
              phone: 'never', 
              address: 'never', 
            }
          }
        }}
      />
      
      {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>}
      
      <div className="flex gap-4 mt-6">
        <button 
            type="button" 
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-300"
        >
            Отмена
        </button>
        <button 
            type="submit" 
            disabled={!stripe || loading}
            className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50"
        >
            {loading ? 'Обработка...' : `Оплатить ${amount} ₴`}
        </button>
      </div>
    </form>
  );
}

export default function PaymentModal({ amount, onClose, onSuccess }) {
  const [clientSecret, setClientSecret] = useState('');

  useState(() => {
    fetch('http://localhost:5000/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  if (!clientSecret) return <div className="p-4">Загрузка кассы...</div>;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Оплата заказа 💳</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
        </div>
        
        {/* Добавляем stripe-theme для отключения лишних визуальных элементов Link, если возможно */}
        <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe', labels: 'floating' } }}>
          <CheckoutForm amount={amount} onSuccess={onSuccess} onClose={onClose} />
        </Elements>
      </div>
    </div>
  );
}