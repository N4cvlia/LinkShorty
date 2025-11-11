import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SitemapService {
  generateSitemap(): string {
    const baseUrl = "https://linkshorty.vercel.app";
    const pages = [
      { url: '/', priority: 1.0, changefreq: 'daily' },
      { url: '/home', priority: 1.0, changefreq: 'daily' },
      { url: '/login', priority: 0.8, changefreq: 'monthly' },
      { url: '/register', priority: 0.8, changefreq: 'monthly' },
      { url: '/dashboard', priority: 0.9, changefreq: 'weekly' },
      { url: '/stats', priority: 0.9, changefreq: 'weekly' }
    ];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    pages.forEach(page => {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}${page.url}</loc>\n`;
      sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
      sitemap += `    <priority>${page.priority}</priority>\n`;
      sitemap += `  </url>\n`;
    });

    sitemap += `</urlset>`;
    return sitemap;
  }
}
