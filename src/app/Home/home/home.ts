import { Component } from '@angular/core';
import { SupabaseService } from '../../Services/supabase';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  url: string = '';
  loading: boolean = false;
  result: { shortCode: string; shortUrl: string; originalUrl: string } | null = null;
  error: string = '';
  copied: boolean = false;

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit() {
    
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
      this.result = await
      this.supabaseService.ShortenUrl(this.url.trim());
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
}
