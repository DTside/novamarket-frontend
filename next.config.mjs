/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Разрешаем ВСЁ
      },
    ],
    unoptimized: true, // Отключаем оптимизацию (чтобы избежать ошибок 404)
  },
};

export default nextConfig;