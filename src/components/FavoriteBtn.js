'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FavoriteBtn({ productId }) {
  const [isLiked, setIsLiked] = useState(false);
  const [userId, setUserId] = useState(null);

  // При загрузке проверяем: лайкнут ли этот товар?
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserId(user.id);
      
      // Спрашиваем у сервера список лайков
      fetch(`http://localhost:5000/favorites/ids/${user.id}`)
        .then(res => res.json())
        .then(ids => {
            if (ids.includes(productId)) setIsLiked(true);
        })
        .catch(console.error);
    }
  }, [productId]);

  const toggleLike = async (e) => {
    e.preventDefault(); // Чтобы клик по карточке не открывал товар
    e.stopPropagation();

    if (!userId) {
        toast.error("Войдите, чтобы добавлять в избранное");
        return;
    }

    // Оптимистичное обновление (сразу меняем цвет)
    const newStatus = !isLiked;
    setIsLiked(newStatus);

    if (newStatus) {
        // Лайкаем
        await fetch('http://localhost:5000/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, product_id: productId })
        });
        toast.success("Добавлено в избранное ❤️");
    } else {
        // Убираем лайк
        await fetch(`http://localhost:5000/favorites/${userId}/${productId}`, {
            method: 'DELETE'
        });
        toast("Удалено из избранного");
    }
  };

  return (
    <button 
      onClick={toggleLike}
      className={`p-2 rounded-full transition-all active:scale-90 shadow-sm ${
        isLiked ? 'bg-red-50 text-red-500' : 'bg-white/80 text-gray-400 hover:text-red-500'
      }`}
    >
      <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
    </button>
  );
}