import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: {
    domains: ['i.pravatar.cc', "nuestrodesafioclimatico.minam.gob.pe", "images.unsplash.com", "avatars.githubusercontent.com"],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);