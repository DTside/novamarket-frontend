export default function FAQPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white/60 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-sm border border-white/50">
        <h1 className="text-4xl font-black text-gray-900 mb-10 text-center">Частые вопросы</h1>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 mb-2">Как отследить мой заказ?</h3>
            <p className="text-gray-600">После отправки заказа вы получите SMS и Email с номером ТТН Новой Почты. Также статус заказа можно проверить в Личном кабинете.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 mb-2">Можно ли оформить кредит?</h3>
            <p className="text-gray-600">Да, мы сотрудничаем с Monobank (Покупка частями) и PrivatBank (Оплата частями). Выберите соответствующий пункт при оплате.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 mb-2">Техника оригинальная?</h3>
            <p className="text-gray-600">Абсолютно. Мы продаем только новую, оригинальную технику Apple, Sony, Dyson и других брендов с заводской гарантией.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 mb-2">Есть ли у вас физический магазин?</h3>
            <p className="text-gray-600">Да, наш флагманский шоурум находится в Киеве по адресу ул. Крещатик, 1. Ждем вас ежедневно с 10:00 до 20:00.</p>
          </div>
        </div>
      </div>
    </div>
  );
}