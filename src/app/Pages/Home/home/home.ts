import { Component, ElementRef, ViewChild } from '@angular/core';
import { SupabaseService } from '../../../Services/supabase';
import { FormsModule } from '@angular/forms';
import { QRCodeComponent } from 'angularx-qrcode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [FormsModule, QRCodeComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  @ViewChild('qrcode', { static: false }) qrcode!: ElementRef;

  url: string = '';
  loading: boolean = false;
  result: { shortCode: string; shortUrl: string; originalUrl: string; statsUrl: string } | null = null;
  error: string = '';
  copied: boolean = false;
  closed: boolean = true;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  ngOnInit() {
    const lastShortened = this.getLastShortened();
    if(lastShortened) {
      this.result = lastShortened;
    }
  }

  saveLastShortened(shortCode: string, shortUrl: string, originalUrl: string, statsUrl: string) {
    const data = { shortCode, shortUrl, originalUrl, statsUrl };
    localStorage.setItem('lastShortened', JSON.stringify(data));
  }

  getLastShortened() {
    const data = localStorage.getItem('lastShortened');
    return data ? JSON.parse(data) : null;
  }

  async shortenUrl() {
    if(!this.url.trim()) {
      this.error = 'Please enter a URL';
      return;
    }

    this.loading = true;
    this.error = '';
    this.result = null;

    try {
      this.result = await this.supabaseService.ShortenUrl(this.url.trim());
      this.saveLastShortened(this.result.shortCode, this.result.shortUrl, this.result.originalUrl, this.result.statsUrl);
    } catch(err: any) {
      this.error = err.message || 'Failed to shorten URL';
      console.error('Error:', err);
    } finally {
      this.loading = false;
    }
  }

  async copyToClipboard() {
    if(this.result?.shortUrl) {
      await 
      navigator.clipboard.writeText(this.result.shortUrl);
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    }
  }

  downloadQRCode() {
    const canvas = this.qrcode.nativeElement.querySelector('canvas');
    if(!canvas) return;

    canvas.toBlob((blob: Blob | null) => {
      if(blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `qr-code-${this.result?.shortCode}.png`;
        link.click();
        URL.revokeObjectURL(url);
      }
    });
  }
  closeIt() {
    this.closed = !this.closed;
  }
}
