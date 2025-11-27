import { Inter } from "next/font/google";
import "./globals.css"; // Стили Tailwind
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CartProvider } from "../context/CartContext";
import { Toaster } from 'react-hot-toast';
import TelegramButton from "../components/TelegramButton"; // <--- Твоя новая кнопка
import '../i18n'; // Настройки языков

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NovaMarket",
  description: "Лучший магазин техники",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <CartProvider>
          
          {/* Основной контейнер: растягиваем на всю высоту, чтобы прижать футер */}
          <div className="flex flex-col min-h-screen">
            
            <Header />
            
            {/* Контент страницы растягивается */}
            <main className="flex-grow">
              {children}
            </main>
            
            <Footer />
            
          </div>

          {/* Плавающие элементы (поверх всего сайта) */}
          <TelegramButton />
          <Toaster position="top-right" />
          
        </CartProvider>
      </body>
    </html>
  );
}