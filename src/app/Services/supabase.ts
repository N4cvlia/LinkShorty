import { Injectable } from '@angular/core';
import { createClient , NavigatorLockAcquireTimeoutError, Session, SupabaseClient} from '@supabase/supabase-js';
import { UrlStats } from '../Interfaces/url-stats';
import { environment } from '../../environments/environment';
import { getReCaptchaToken } from '../Utils/load-recaptcha';
import { UrlData } from '../Interfaces/url-data';
import { ClickData } from '../Interfaces/click-data';
import { ChartDataPoint } from '../Interfaces/chart-data-point';
import { eachDayOfInterval, format, parseISO, startOfDay, subDays } from 'date-fns';
import { ca } from 'date-fns/locale';

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
  // ========== Advanced Stats Methods ==========
  async getClickData(shortCode: string): Promise<ClickData[]> {
    try {
      const { data, error } = await this.supabase
        .from('url_clicks')
        .select('id, clicked_at, referrer, user_agent, country, city, device_type, browser, os')
        .eq('short_code', shortCode)
        .order('clicked_at', { ascending: true });

      if (error) throw error;
      return data || []
    }catch (error){
      console.error("Error fetching click data:", error);
      throw new Error('Failed to fetch click data')
    }
  }

  async getChartData(shortCode: string, days: number = 7): Promise<ChartDataPoint[]> {
    try {
      const clickData = await this.getClickData(shortCode);

      const dateRange = eachDayOfInterval({
        start: subDays(new Date(), days - 1),
        end: new Date()
      });

      return dateRange.map(day => {
        const dayStart = startOfDay(day);
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);

        const count = clickData.filter(click => {
          const clickDate = parseISO(click.clicked_at);
          return clickDate >= dayStart && clickDate < dayEnd;
        }).length;

        return {
          date: format(day, 'MMM dd'),
          clicks: count
        };
      });
    }catch (error){
      console.error("Error generating chart data:", error);
      throw new Error('Failed to generate chart data')
    }
  }

  async getTopCountries(shortCode: string, limit: number = 5): Promise<{country: string; count: number}[]> {
    try {
      const clickData = await this.getClickData(shortCode);

      const countryCounts = clickData.reduce((acc, click) => {
        const country = click.country || 'Unknown';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(countryCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
    }catch (error){
      console.error("Error fetching top countries:", error);
      throw new Error('Failed to fetch top countries')
    }
  }

  async getDeviceStats(shortCode: string): Promise<{ name: string; value: number }[]> {
    try {
      const clickData = await this.getClickData(shortCode);

      const deviceCounts = clickData.reduce((acc, click) => {
        const device = click.device_type || 'Unknown';
        acc[device] = (acc[device] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(deviceCounts)
      .map(([name, value]) => ({ name, value }))
    } catch (error){
      console.error("Error fetching device stats:", error);
      throw new Error('Failed to fetch device stats')
    }
  }
  async getBrowserStats(shortCode: string, limit: number = 5): Promise<{ name: string, value: number}[]> {
    try {
      const clickData = await this.getClickData(shortCode);

      const browserCounts = clickData.reduce((acc, click) => {
        const browser = click.browser || 'Unknown';
        acc[browser] = (acc[browser] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(browserCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);
    }catch (error){
      console.error("Error fetching browser stats:", error);
      throw new Error('Failed to fetch browser stats')
    }
  }

  async getRecentClicks(shortCode: string, limit: number = 5): Promise<ClickData[]> {
    try {
      const { data, error } = await this.supabase
      .from('url_clicks')
      .select('id, clicked_at, referrer, user_agent, country, city, device_type, browser, os')
      .eq('short_code', shortCode)
      .order('clicked_at', { ascending: false })
      .limit(limit);

      if (error) throw error;
      return data || [];
    }catch (error){
      console.error("Error fetching recent clicks:", error);
      throw new Error('Failed to fetch recent clicks')
    }
  }

  setupRealtimeSubscription(shortCode: string, callback: (payload: any) => void) {
    return this.supabase
    .channel('url-clicks-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'url_clicks',
        filter: `short_code=eq.${shortCode}`
      },
      callback
    )
    .subscribe();
  }
}
