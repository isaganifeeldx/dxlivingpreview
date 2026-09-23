import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';
import { getS3ImageRemotePatterns } from './src/lib/cms/mediaStorage';

function siteActionOrigins(): string[] {
  const origins = new Set(['localhost:3000', 'localhost:3005']);

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || '').trim();
  if (siteUrl) {
    try {
      const url = new URL(
        /^https?:\/\//i.test(siteUrl) ? siteUrl : `https://${siteUrl}`,
      );
      origins.add(url.host);
    } catch {
      // ignore invalid NEXT_PUBLIC_SITE_URL
    }
  }

  return [...origins];
}

const nextConfig: NextConfig = {
  serverExternalPackages: ['gsap'],
  htmlLimitedBots: /.*/,
  experimental: {
    // Required for a custom 404 with multiple root layouts (`(frontend)` / `(payload)`).
    globalNotFound: true,
    serverActions: {
      allowedOrigins: siteActionOrigins(),
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.vimeocdn.com',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: '*.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: '*.vercel.app',
      },
      ...getS3ImageRemotePatterns(),
    ],
    localPatterns: [
      {
        pathname: '/images/**',
      },
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/pages/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/pages/about',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/pages/modules',
        destination: '/modules',
        permanent: true,
      },
      {
        source: '/pages/studio',
        destination: '/studio',
        permanent: true,
      },
      {
        source: '/pages/privacy-policy',
        destination: '/privacy-policy',
        permanent: true,
      },
      {
        source: '/pages/terms-of-service',
        destination: '/terms-of-service',
        permanent: true,
      },
      {
        source: '/pages/faq',
        destination: '/faq',
        permanent: true,
      },
      {
        source: '/pages/interiors',
        destination: '/interiors',
        permanent: true,
      },
      {
        source: '/pages/model',
        destination: '/model',
        permanent: true,
      },
      {
        source: '/pages/prestige',
        destination: '/prestige',
        permanent: true,
      },
      {
        source: '/pages/suppliers',
        destination: '/suppliers',
        permanent: true,
      },
      {
        source: '/pages/apply',
        destination: '/apply',
        permanent: true,
      },
      {
        source: '/pages/contact',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/pages/projects',
        destination: '/projects',
        permanent: true,
      },
      {
        source: '/pages/projects/:slug',
        destination: '/projects/:slug',
        permanent: true,
      },
      {
        source: '/pages/articles',
        destination: '/articles',
        permanent: true,
      },
      {
        source: '/pages/articles/:slug',
        destination: '/articles/:slug',
        permanent: true,
      },
      {
        source: '/projects/85-commodore-drive-surfers-paradise',
        destination: '/projects/85-commodore-drive',
        permanent: true,
      },
      {
        source: '/supplier',
        destination: '/suppliers',
        permanent: true,
      },
      {
        source: '/pages/login',
        destination: '/login',
        permanent: true,
      },
      {
        source: '/pages/register',
        destination: '/register',
        permanent: true,
      },
      {
        source: '/pages/verify-email',
        destination: '/verify-email',
        permanent: true,
      },
      {
        source: '/pages/start-interactive',
        destination: '/start-interactive',
        permanent: true,
      },
      {
        source: '/pages/start-interactive/dx-model',
        destination: '/start-interactive/dx-model',
        permanent: true,
      },
      {
        source: '/pages/start-interactive/dx-model-lite',
        destination: '/start-interactive/dx-model-lite',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      { source: '/', destination: '/pages/home' },
      { source: '/about', destination: '/pages/about' },
      { source: '/modules', destination: '/pages/modules' },
      { source: '/studio', destination: '/pages/studio' },
      { source: '/privacy-policy', destination: '/pages/privacy-policy' },
      { source: '/terms-of-service', destination: '/pages/terms-of-service' },
      { source: '/faq', destination: '/pages/faq' },
      { source: '/login', destination: '/pages/login' },
      { source: '/register', destination: '/pages/register' },
      { source: '/verify-email', destination: '/pages/verify-email' },
      { source: '/start-interactive', destination: '/pages/start-interactive' },
      {
        source: '/start-interactive/dx-model',
        destination: '/pages/start-interactive/dx-model',
      },
      {
        source: '/start-interactive/dx-model-lite',
        destination: '/pages/start-interactive/dx-model-lite',
      },
      { source: '/interiors', destination: '/pages/interiors' },
      { source: '/model', destination: '/pages/model' },
      { source: '/prestige', destination: '/pages/prestige' },
      { source: '/suppliers', destination: '/pages/suppliers' },
      { source: '/apply', destination: '/pages/apply' },
      { source: '/contact', destination: '/pages/contact' },
      { source: '/projects', destination: '/pages/projects' },
      { source: '/projects/:slug', destination: '/pages/projects/:slug' },
      { source: '/articles', destination: '/pages/articles' },
      { source: '/articles/:slug', destination: '/pages/articles/:slug' },
    ];
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    };
    return webpackConfig;
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
