import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: siteConfig.url,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/app`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/app/focus`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
}
