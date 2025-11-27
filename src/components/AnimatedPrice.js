'use client';

import { useEffect, useRef } from 'react';
import { useMotionValue, useSpring, useInView } from 'framer-motion';

export default function AnimatedPrice({ value, currency = '₴' }) {
  const ref = useRef(null);
  const motionValue = useMotionValue(0); // Начальное значение
  
  // Настройки пружины (жесткость и затухание влияют на скорость)
  const springValue = useSpring(motionValue, { damping: 30, stiffness: 200 });
  const isInView = useInView(ref);

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, value, isInView]);

  useEffect(() => {
    // Подписываемся на изменения пружины и обновляем текст
    springValue.on("change", (latest) => {
      if (ref.current) {
        // Форматируем число (пробелы между тысячами)
        ref.current.textContent = Intl.NumberFormat('ru-RU').format(Math.floor(latest));
      }
    });
  }, [springValue]);

  return (
    <span className="flex items-baseline">
      <span ref={ref}>0</span>
      <span className="ml-1 text-sm">{currency}</span>
    </span>
  );
}