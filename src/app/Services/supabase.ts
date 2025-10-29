import { Injectable } from '@angular/core';
import { createClient , Session, SupabaseClient} from '@supabase/supabase-js';
import { UrlStats } from '../Interfaces/url-stats';
import { environment } from '../../environments/environment';
import { getReCaptchaToken } from '../Utils/load-recaptcha';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.anonKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      }
      );
  }
  // ========== AUTH METHODS ==========

  async signUp(firstName: string, lastName: string, phone: string, email: string, password: string) {
    const redirectUrl = `${window.location.origin}/`;

    const { data, error } = await this.supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: phone.trim()
        }
      }
    });

    if(!error && data?.user?.identities?.length === 0) {
      return {
        data,
        error: { message: "Email already registered."}
      }
    }

    return { data ,error };
  }

  async signIn(email: string, password: string) {
    const { error } = await this.supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });

    return { error };
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    return { error };
  }

  async getSession() {
    return await this.supabase.auth.getSession();
  }

  onAuthStateChange(callback: (event: any, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }


  // ========== URL METHODS ==========
  async ShortenUrl(url: string): Promise<{shortCode: string;
    shortUrl: string; originalUrl: string; statsUrl: string
  }> {
    const token = await getReCaptchaToken();
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

  getClient(): SupabaseClient {
    return this.supabase;
  }
}
