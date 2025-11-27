export default function ContactsPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white/60 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-sm border border-white/50">
        <h1 className="text-4xl font-black text-gray-900 mb-8">Свяжитесь с нами</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Левая часть: Инфо */}
            <div className="space-y-8">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">📍 Адрес шоурума</h3>
                    <p className="text-gray-600">Украина, г. Киев</p>
                    <p className="text-gray-600">ул. Крещатик, 1 (ТЦ ЦУМ, 5 этаж)</p>
                </div>

                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">📞 Телефоны</h3>
                    <p className="text-gray-600 text-lg font-medium">+38 (044) 123-45-67</p>
                    <p className="text-gray-600">+38 (097) 000-00-00 (Viber/Telegram)</p>
                </div>

                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">✉️ Email</h3>
                    <p className="text-purple-600 font-medium">support@novamarket.com</p>
                    <p className="text-gray-500 text-sm">sales@novamarket.com (Для партнеров)</p>
                </div>

                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">🕒 График работы</h3>
                    <p className="text-gray-600">Пн-Пт: 09:00 - 21:00</p>
                    <p className="text-gray-600">Сб-Вс: 10:00 - 20:00</p>
                </div>
            </div>

            {/* Правая часть: Форма обратной связи (Визуальная) */}
            <div className="bg-white p-8 rounded-2xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Напишите нам</h3>
                <form className="space-y-4">
                    <input type="text" placeholder="Ваше имя" className="w-full border bg-gray-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-200" />
                    <input type="email" placeholder="Ваш Email" className="w-full border bg-gray-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-200" />
                    <textarea rows="4" placeholder="Ваше сообщение..." className="w-full border bg-gray-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-200"></textarea>
                    <button type="button" className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-purple-600 transition">Отправить</button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
}