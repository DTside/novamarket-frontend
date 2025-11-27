'use client';

import { Send } from 'lucide-react'; // Или иконка MessageCircle

export default function TelegramButton() {
  // Замени на имя своего бота (без @)
  const BOT_USERNAME = "novamarket_admin_bot"; 

  return (
    <a 
      href={`https://t.me/${BOT_USERNAME}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#24A1DE] rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer animate-bounce-slow"
      title="Написать в поддержку"
    >
      {/* Иконка бумажного самолетика (как лого ТГ) */}
      <Send className="text-white w-6 h-6 -ml-1 mt-1" />
      
      {/* Пульсирующий круг для привлечения внимания */}
      <span className="absolute w-full h-full rounded-full bg-[#24A1DE] opacity-20 animate-ping"></span>
    </a>
  );
}