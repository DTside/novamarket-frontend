'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CardForm from '../../components/CardForm';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';

// Компонент формы смены пароля (внизу файла)
function ChangePasswordForm({ userId }) {
  const [passData, setPassData] = useState({ old: '', new: '' });
  const [loading, setLoading] = useState(false);

  const handleChangePass = async (e) => {
    e.preventDefault();
    if (!passData.old || !passData.new) return toast.error("Заполните все поля");
    setLoading(true);
    try {
        const res = await fetch(`http://localhost:5000/users/${userId}/password`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ oldPassword: passData.old, newPassword: passData.new })
        });
        const data = await res.json();
        if (res.ok) {
            toast.success("Пароль успешно изменен! 🔥");
            setPassData({ old: '', new: '' });
        } else {
            toast.error(data.message);
        }
    } catch (err) { toast.error("Ошибка сервера"); } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleChangePass} className="flex flex-col gap-3">
        <input type="password" placeholder="Старый пароль" className="border bg-gray-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-red-200 transition text-sm" value={passData.old} onChange={(e) => setPassData({...passData, old: e.target.value})} />
        <input type="password" placeholder="Новый пароль" className="border bg-gray-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-red-200 transition text-sm" value={passData.new} onChange={(e) => setPassData({...passData, new: e.target.value})} />
        <button disabled={loading} className="bg-red-50 text-red-600 font-bold py-3 rounded-xl hover:bg-red-100 transition disabled:opacity-50 text-sm mt-1">{loading ? "Обновление..." : "Обновить пароль"}</button>
    </form>
  );
}

export default function ProfilePage() {
  // ВСЕ ХУКИ ВНУТРИ ФУНКЦИИ!
  const [orders, setOrders] = useState([]);
  const [cards, setCards] = useState([]);
  const [favorites, setFavorites] = useState([]); // <--- Вот твой потерянный хук
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: '', avatar_url: '' });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);
    setEditForm({ full_name: userData.full_name, avatar_url: userData.avatar_url || '' });

    fetch(`http://localhost:5000/users/${userData.id}/orders`).then(res => res.json()).then(data => setOrders(data));
    fetch(`http://localhost:5000/users/${userData.id}/cards`).then(res => res.json()).then(data => setCards(data));
    // Загрузка избранного
    fetch(`http://localhost:5000/favorites/${userData.id}`).then(res => res.json()).then(data => setFavorites(data));
  }, []);

  const handleUpdateProfile = async () => {
    try {
        const res = await fetch(`http://localhost:5000/users/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editForm)
        });
        if (res.ok) {
            const updatedUser = await res.json();
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const mergedUser = { ...currentUser, ...updatedUser };
            localStorage.setItem('user', JSON.stringify(mergedUser));
            setUser(mergedUser);
            setIsEditing(false);
            toast.success('Профиль обновлен!');
            window.dispatchEvent(new Event("storage"));
        }
    } catch (err) { toast.error('Ошибка обновления'); }
  };

  const deleteCard = async (id) => {
    if(!confirm('Удалить карту?')) return;
    await fetch(`http://localhost:5000/cards/${id}`, { method: 'DELETE' });
    setCards(cards.filter(c => c.id !== id));
    toast.success('Карта удалена');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-8 rounded-3xl shadow-sm mb-8 border border-gray-100">
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-purple-100 flex items-center justify-center border-4 border-white shadow-lg">
                    {user.avatar_url ? (<img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />) : (<span className="text-4xl">👤</span>)}
                </div>
                <div className="flex-grow text-center md:text-left w-full">
                    {isEditing ? (
                        <div className="flex flex-col gap-3 max-w-sm">
                            <input type="text" className="border p-2 rounded-lg" placeholder="Ваше имя" value={editForm.full_name} onChange={(e) => setEditForm({...editForm, full_name: e.target.value})} />
                            <input type="text" className="border p-2 rounded-lg" placeholder="Ссылка на фото (URL)" value={editForm.avatar_url} onChange={(e) => setEditForm({...editForm, avatar_url: e.target.value})} />
                            <div className="flex gap-2">
                                <button onClick={handleUpdateProfile} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">Сохранить</button>
                                <button onClick={() => setIsEditing(false)} className="bg-gray-300 px-4 py-2 rounded-lg text-sm">Отмена</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-3xl font-black text-gray-900 flex items-center justify-center md:justify-start gap-3">
                                {user.full_name}
                                <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-purple-600 text-sm transition">✏️</button>
                            </h1>
                            <p className="text-gray-500 font-medium">{user.email}</p>
                            {user.role === 'admin' && <span className="inline-block mt-2 text-[10px] bg-black text-white px-2 py-1 rounded font-bold tracking-widest">ADMIN</span>}
                        </>
                    )}
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
                {/* ИСТОРИЯ */}
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">📦 История заказов</h2>
                    {orders.length === 0 ? (<div className="bg-white p-8 rounded-2xl text-center text-gray-400 border border-dashed border-gray-300">Заказов пока нет</div>) : (
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {orders.map((order) => (
                            <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
                                <div className="flex justify-between mb-3"><span className="font-bold text-gray-900">Заказ №{order.id}</span><span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{order.status}</span></div>
                                <div className="flex justify-between items-end border-t pt-3 border-gray-100"><div className="text-gray-400 text-xs">{new Date(order.created_at).toLocaleDateString()}</div><div className="text-purple-600 font-black text-lg">{order.total_price} ₴</div></div>
                            </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ИЗБРАННОЕ */}
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">❤️ Избранное ({favorites.length})</h2>
                    {favorites.length === 0 ? (<p className="text-gray-500">Список пуст.</p>) : (
                        <div className="grid grid-cols-2 gap-4">
                            {favorites.map(item => (
                                <Link href={`/product/${item.id}`} key={item.id} className="bg-white p-3 rounded-xl shadow-sm flex flex-col items-center border hover:border-purple-200 transition text-center group">
                                    <div className="relative w-full h-32 mb-2"><Image src={item.image_url} alt={item.title} fill className="object-contain group-hover:scale-105 transition" /></div>
                                    <p className="font-bold text-xs line-clamp-1">{item.title}</p>
                                    <p className="text-purple-600 font-bold text-sm">{item.price} ₴</p>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-8">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">💳 Мой кошелек</h2>
                    <div className="space-y-3 mb-6">
                        {cards.map(card => (
                            <div key={card.id} className="bg-gray-900 text-white p-5 rounded-2xl flex justify-between items-center shadow-lg transform hover:-translate-y-1 transition">
                                <div><p className="text-xs text-gray-400 font-bold tracking-widest uppercase mb-1">{card.brand}</p><p className="font-mono text-xl tracking-widest">•••• •••• •••• {card.last_4_digits}</p></div>
                                <button onClick={() => deleteCard(card.id)} className="text-gray-500 hover:text-red-400 transition p-2">✕</button>
                            </div>
                        ))}
                    </div>
                    <CardForm userId={user.id} onCardAdded={(newCard) => { setCards([...cards, newCard]); toast.success('Карта привязана'); }} />
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">🔐 Смена пароля</h2>
                    <ChangePasswordForm userId={user.id} />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}