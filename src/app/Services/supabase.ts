import { Injectable } from '@angular/core';
import { createClient , SupabaseClient} from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      'https://gnuyfalawunhjgublxsu.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdudXlmYWxhd3VuaGpndWJseHN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NDU5NjgsImV4cCI6MjA3NjQyMTk2OH0.fmM-UsA167Kxcbefc6ocLwqoNiyK_r4SMMOmNvR-LAc',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      }
      );
  }

  async ShortenUrl(url: string): Promise<{shortCode: string;
    shortUrl: string; originalUrl: string
  }> {
    const { data, error} = await
    this.supabase.functions.invoke('shorten-url', {
      body: { url}
    });

    if(error) throw error;
    return data;
  }

  async getUrlByShortCode(shortCode: string) {
    const { data, error} = await this.supabase
    .from('urls')
    .select('original_url, clicks')
    .eq('short_code', shortCode)
    .maybeSingle();

    if (error) throw error;
    return data;
  }

  async incrementClicks(shortCode: string, currentClicks: number) {
    const { error } = await this.supabase
    .from('urls')
    .update({ clicks: currentClicks + 1 })
    .eq('short_code', shortCode);

    if(error) console.error('Failed to increment clicks:', error);
  }
}
