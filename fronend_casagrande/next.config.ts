import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['plus.unsplash.com', 'images.unsplash.com'], // Agrega el dominio externo aquí
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
 
