import { Injectable } from '@angular/core';
import { createClient , NavigatorLockAcquireTimeoutError, Session, SupabaseClient} from '@supabase/supabase-js';
import { UrlStats } from '../Interfaces/url-stats';
import { environment } from '../../environments/environment';
import { getReCaptchaToken } from '../Utils/load-recaptcha';
import { UrlData } from '../Interfaces/url-data';

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
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
        }
      });

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
    const session = await this.getSession();
    const token = await getReCaptchaToken();
    const { data, error} = await
    this.supabase.functions.invoke('shorten-url', {
      body: { 
        url: url,
        recaptchaToken: token,
        userId: session?.data.session?.user.id || null
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
  async fetchUserUrls(userId: string): Promise<UrlData[]> {
    try {
      const { data, error } = await this.supabase
        .from('urls')
        .select('id, short_code, original_url, clicks, created_at, management_token')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

        if(error) throw error;

        return (data || []) as UrlData[];
    }catch(error){
      console.error("Error fetching URLs:", error);
      throw new Error('Failed to fetch URLS')
    }
  }
}
