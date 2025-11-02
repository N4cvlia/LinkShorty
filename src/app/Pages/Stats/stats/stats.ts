import { Component, OnInit } from '@angular/core';
import { UrlStats } from '../../../Interfaces/url-stats';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../../../Services/supabase';
import { StatsResolveData } from '../../../Interfaces/stats-resolve-data';
import { ClickData } from '../../../Interfaces/click-data';
import { ChartDataPoint } from '../../../Interfaces/chart-data-point';
import { CommonModule } from '@angular/common';
import { formatDistanceToNow, parseISO } from 'date-fns';

@Component({
  selector: 'app-stats',
  imports: [CommonModule],
  templateUrl: './stats.html',
  styleUrl: './stats.css'
})
export class Stats implements OnInit{
  private fromPage: string = 'home';
  loading = false;
  closed = true;
  stats: UrlStats | null = null;
  error: string | null = null;

  clickData: ClickData[] = [];
  chartData: ChartDataPoint[] = [];
  topCounties: { country: string; count: number }[] = [];
  deviceStats: { name: string; value: number }[] = [];
  browserStats: { name: string; value: number }[] = [];
  recentClicks: ClickData[] = [];
  private channel: any = null;

  constructor(
    private route: ActivatedRoute,
    private supabaseService: SupabaseService,
    private router: Router
  ){}

  async ngOnInit(){
    const resolvedData: StatsResolveData = this.route.snapshot.data['statsData'];
    const state = window.history.state;

    if(state && state.from) {
      this.fromPage = state.from;
    }

    this.stats = resolvedData.stats;
    this.error = resolvedData.error;

    if(this.stats) {
      await this.loadAdvancedStats();
    }
  }

  ngOnDestroy() {
    if (this.channel) {
      this.supabaseService.getClient().removeChannel(this.channel);
    }
  }

  private async loadAdvancedStats() {
    if(!this.stats) return;

    try {
      const [
        clickData,
        chartData,
        topCountries,
        deviceStats,
        browserStats,
        recentClicks
      ] = await Promise.all([
        this.supabaseService.getClickData(this.stats.short_code),
        this.supabaseService.getChartData(this.stats.short_code),
        this.supabaseService.getTopCountries(this.stats.short_code),
        this.supabaseService.getDeviceStats(this.stats.short_code),
        this.supabaseService.getBrowserStats(this.stats.short_code),
        this.supabaseService.getRecentClicks(this.stats.short_code)
      ]);

      this.clickData = clickData;
      this.chartData = chartData;
      this.topCounties = topCountries;
      this.deviceStats = deviceStats;
      this.browserStats = browserStats;
      this.recentClicks = recentClicks;

      this.setupRealtimeUpdates();
    } catch(error) {
      console.error('Error loading advanced stats:', error);
    }
  }

  private setupRealtimeUpdates() {
    if(!this.stats) return;
      
      this.channel = this.supabaseService.setupRealtimeSubscription(
        this.stats.short_code,
        (payload: any) => {
          console.log('Realtime update received:', payload);
          const newClick = payload.new as ClickData;

          this.recentClicks = [newClick, ...this.recentClicks].slice(0, 4);

          if (this.stats) {
            this.stats = { ...this.stats, clicks: this.stats.clicks + 1 };
          }
        }
      )  
  }

  get avgClicksPerDay(): string {
    if (!this.stats || this.stats.clicks === 0) return '0';

    const days = Math.max(1, Math.ceil((Date.now() - new Date(this.stats.created_at).getTime()) / (1000 * 60 * 60 * 24)));
    return (this.stats.clicks / days).toFixed(1);
  }

  get shortUrl(): string {
    return `${window.location.origin}/${this.stats?.short_code}`;
  }

  get createdDate(): string {
    return new Date(this.stats!.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  formatDistanceToNow(date: string): string {
    return formatDistanceToNow(parseISO(date), { addSuffix: true });
  }
  goBack() {
    if(this.fromPage === 'home') {
      this.router.navigate(['/']);
    }else {
      this.router.navigate(['/dashboard']);
    }
  }
  goHome() {
    this.router.navigate(['/']);
  }
  closeIt() {
    this.closed = !this.closed;
  }
}
