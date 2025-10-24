import { Injectable } from '@angular/core';
import { createClient , SupabaseClient} from '@supabase/supabase-js';
import { UrlStats } from '../Interfaces/url-stats';

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
    shortUrl: string; originalUrl: string; statsUrl: string
  }> {
    const token = await (window as any).grecaptcha.execute('6Ld83O8rAAAAAD3hI-7akxvtb4bgWQJVltdwvmzK', { action: 'shorten'});
    const { data, error} = await
    this.supabase.functions.invoke('shorten-url', {
      body: { 
        url: url,
        recaptchaToken: token
      }
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

  async incrementClicks(shortCode: string) {
    // fetch(`https://gnuyfalawunhjgublxsu.supabase.co/functions/v1/increment-clicks`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'apiKey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdudXlmYWxhd3VuaGpndWJseHN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NDU5NjgsImV4cCI6MjA3NjQyMTk2OH0.fmM-UsA167Kxcbefc6ocLwqoNiyK_r4SMMOmNvR-LAc'
    //   },
    //   body: JSON.stringify({ shortCode })
    // }).catch(err => console.error('Failed to increment clicks via function:', err));
    const { error } = await this.supabase.functions.invoke('increment-clicks', {
      body: { shortCode }
    });

    if (error) {
      console.error('Failed to increment clicks via function:', error);
    }
  }

  async getStatsByToken(token: string): Promise<{data: UrlStats | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase
        .from('urls')
        .select('original_url, short_code, clicks, created_at')
        .eq('management_token', token)
        .maybeSingle();

      if(error) {
        console.error('Supabase error:', error);
        return { data: null, error: 'Database error occurred' };
      }

      if(!data) {
        return { data: null, error: 'No data found for the provided token' };
      }

      return {data, error: null};
    } catch (err) {
      console.error('Error fetching stats:', err);
      return { data: null, error: 'Failed to load statistics' };
    }
  }
}
