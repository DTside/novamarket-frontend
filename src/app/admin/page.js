'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. Проверка безопасности: Ты админ?
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user || user.role !== 'admin') {
      alert("Доступ запрещен! Только для администраторов.");
      router.push('/'); // Выгоняем на главную
      return;
    }

    // 2. Загружаем все заказы
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('https://novamarket-api.onrender.com/admin/orders');
      const data = await res.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Функция смены статуса
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`https://novamarket-api.onrender.com/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Обновляем список локально, чтобы не перезагружать страницу
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        alert(`Статус заказа №${orderId} изменен на "${newStatus}"`);
      }
    } catch (err) {
      alert("Ошибка при обновлении");
    }
  };

  // Вспомогательная функция для цвета статуса
  const getStatusColor = (status) => {
    switch(status) {
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="text-center py-20">Загрузка панели управления...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">🛠️ Админ-панель</h1>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-600">ID</th>
                <th className="p-4 font-semibold text-gray-600">Клиент</th>
                <th className="p-4 font-semibold text-gray-600">Сумма</th>
                <th className="p-4 font-semibold text-gray-600">Дата</th>
                <th className="p-4 font-semibold text-gray-600">Статус</th>
                <th className="p-4 font-semibold text-gray-600">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-bold text-gray-700">#{order.id}</td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{order.full_name}</div>
                    <div className="text-sm text-gray-500">{order.email}</div>
                  </td>
                  <td className="p-4 font-bold text-purple-600">{order.total_price} ₴</td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <select 
                      className="border p-2 rounded-lg text-sm bg-white cursor-pointer hover:border-purple-500 outline-none"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="processing">В обработке</option>
                      <option value="shipped">Отправлен</option>
                      <option value="delivered">Доставлен</option>
                      <option value="cancelled">Отменен</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}