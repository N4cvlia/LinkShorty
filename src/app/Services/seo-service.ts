import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private defaultImage = 'background gia.png';

  constructor(
    private meta: Meta,
    private title: Title,
    private router: Router
  ) { }

  updateTitle(title: string) {
    this.title.setTitle(title);
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ name: 'twitter:title', content: title });
  }

  updateDescription(description: string) {
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ name: 'twitter:description', content: description });
  }

  updateKeywords(keywords: string) {
    this.meta.updateTag({ name: 'keywords', content: keywords });
  }

  updateImage(imageUrl: string) {
    this.meta.updateTag({ property: 'og:image', content: imageUrl });
    this.meta.updateTag({ name: 'twitter:image', content: imageUrl });
  }

  updateUrl(url: string) {
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ name: 'twitter:url', content: url });
  }

  updateCanonical(url: string) {
    const head = document.getElementsByTagName('head')[0];
    let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement;

    if(canonical) {
      canonical.href = url;
    }else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', url);
      head.appendChild(canonical);
    }
  }

  updateMetaTags(config: {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    type?: string;
  }){
    const baseUrl = window.location.origin;
    const currentUrl = `${baseUrl}${this.router.url}`;

    const imageUrl = config.image || `${baseUrl}/${this.defaultImage}`;

    this.updateTitle(config.title);
    this.updateDescription(config.description);
    this.updateUrl(currentUrl);
    this.updateCanonical(currentUrl);
    this.updateImage(imageUrl);

    if(config.keywords){
      this.updateKeywords(config.keywords);
    }

    if(config.image){
      this.updateImage(config.image);
    }

    this.meta.updateTag({ property: 'og:type', content: config.type || 'website' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
  }
  addStructuredData(data: any) {
    let script = document.querySelector("script[type='application/ld+json']") as HTMLScriptElement;

    if (script) {
      script.textContent = JSON.stringify(data);
    }else {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    }
  }
}
