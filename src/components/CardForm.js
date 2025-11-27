'use client';

import { useState } from 'react';

export default function CardForm({ userId, onCardAdded }) {
  const [cardNumber, setCardNumber] = useState('');
  const [error, setError] = useState('');

  // --- АЛГОРИТМ ЛУНА (Luhn Algorithm) ---
  const luhnCheck = (val) => {
    let checksum = 0;
    let j = 1;

    // Идем справа налево
    for (let i = val.length - 1; i >= 0; i--) {
      let calc = 0;
      // Каждую вторую цифру умножаем на 2
      calc = Number(val.charAt(i)) * j;

      // Если результат > 9 (например, 18), вычитаем 9 (18-9=9)
      if (calc > 9) {
        checksum = checksum + 1;
        calc = calc - 10;
      }
      checksum = checksum + calc;
      if (j === 1) j = 2; else j = 1;
    }
    // Если сумма делится на 10 без остатка — карта валидна
    return (checksum % 10) === 0;
  };

  const handleChange = (e) => {
    // 1. Убираем всё, кроме цифр
    let val = e.target.value.replace(/\D/g, '');
    
    // 2. Ограничиваем 16 цифрами
    if (val.length > 16) val = val.slice(0, 16);

    // 3. Валидация Луна (только если ввели 16 цифр)
    if (val.length === 16) {
        if (!luhnCheck(val)) {
            setError('Некорректный номер карты (ошибка алгоритма)');
        } else {
            setError('');
        }
    } else {
        setError('');
    }

    // 4. Форматирование: добавляем пробелы каждые 4 цифры
    const formatted = val.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rawNumber = cardNumber.replace(/\s/g, '');

    if (rawNumber.length < 16 || error) {
        setError('Введите полный номер карты');
        return;
    }

    // Определяем бренд (просто для красоты)
    let brand = 'Mastercard';
    if (rawNumber.startsWith('4')) brand = 'Visa';

    try {
        const res = await fetch('http://localhost:5000/cards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, number: rawNumber, brand })
        });
        const data = await res.json();
        onCardAdded(data);
        setCardNumber('');
        alert('Карта успешно привязана!');
    } catch (err) {
        console.error(err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border mt-6">
      <h3 className="font-bold text-lg mb-4">💳 Добавить карту</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
            <label className="text-sm text-gray-500 block mb-1">Номер карты</label>
            <input 
                type="text" 
                placeholder="0000 0000 0000 0000"
                className={`w-full p-3 border rounded-lg outline-none font-mono text-lg ${error ? 'border-red-500 bg-red-50' : 'focus:border-purple-500'}`}
                value={cardNumber}
                onChange={handleChange}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
        <button 
            type="submit" 
            disabled={!!error || cardNumber.length < 19} // 16 цифр + 3 пробела = 19
            className="bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
            Привязать карту
        </button>
      </form>
    </div>
  );
}