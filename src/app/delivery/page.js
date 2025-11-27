export default function DeliveryPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-sm border border-white/50">
        <h1 className="text-4xl font-black text-gray-900 mb-8">Доставка и оплата</h1>
        
        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">🚚 Способы доставки</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Новая Почта (в отделение):</strong> Срок доставки 1-3 дня. Стоимость по тарифам перевозчика (бесплатно от 2000 ₴).</li>
              <li><strong>Курьерская доставка (NovaMarket Express):</strong> Доставка до двери в Киеве, Харькове, Одессе и Львове. Работаем с 09:00 до 21:00.</li>
              <li><strong>Самовывоз:</strong> Вы можете забрать товар бесплатно из нашего шоурума в Киеве (ул. Крещатик, 1).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">💳 Способы оплаты</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Оплата картой на сайте (Stripe):</strong> Visa, Mastercard, Apple Pay, Google Pay. Безопасно и мгновенно.</li>
              <li><strong>Наложенный платеж:</strong> Оплата при получении в отделении Новой Почты (взимается комиссия 2% + 20 грн).</li>
              <li><strong>Оплата частями:</strong> Доступна для клиентов Monobank и PrivatBank (до 6 платежей без переплат).</li>
            </ul>
          </section>

          <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
            <p className="font-bold text-purple-800">Важно!</p>
            <p className="text-sm text-purple-700 mt-1">При получении посылки обязательно проверяйте целостность упаковки и товара. В случае обнаружения повреждений составляйте акт прямо в отделении почты.</p>
          </div>
        </div>
      </div>
    </div>
  );
}