import { Component, OnInit } from '@angular/core';
import { UrlStats } from '../../../Interfaces/url-stats';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../../../Services/supabase';
import { StatsResolveData } from '../../../Interfaces/stats-resolve-data';
import { ClickData } from '../../../Interfaces/click-data';
import { ChartDataPoint } from '../../../Interfaces/chart-data-point';
import { CommonModule } from '@angular/common';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ExportService } from '../../../Services/export';
import { ExportData } from '../../../Interfaces/export-data';
import { ExportButtonsComponent } from '../../../Components/export-buttons-component/export-buttons-component';

@Component({
  selector: 'app-stats',
  imports: [CommonModule, BaseChartDirective, ExportButtonsComponent],
  templateUrl: './stats.html',
  styleUrl: './stats.css'
})
export class Stats implements OnInit{
  private fromPage: string = 'home';
  exporting: boolean = false;
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
    private router: Router,
    private exportService: ExportService
  ){
    window.scrollTo(0,0);
  }

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

      this.updateChartData();

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

          this.loadAdvancedStats();
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

  // Chart.js configurations

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#9ca3af' }
      },
      y: {
        beginAtZero: true,
        ticks: { precision: 0, color: '#9ca3af' },
        grid: { color: 'rgba(156, 163, 175, 0.1)' }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8
      }
    }
  };
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      label: 'Clicks',
      data: [],
      backgroundColor: 'rgb(95, 66, 240)',
      borderRadius: 8
    }]
  };
  
  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [{
      label: 'Clicks',
      data: [],
      borderColor: 'rgb(95, 66, 240)',
      backgroundColor: 'rgba(95, 66, 240, 0.1)',
      tension: 0.4,
      fill: true,
      pointRadius: 4,
      pointHoverRadius: 6
    }]
  };
  public pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        'rgb(95, 66, 240)',
        'rgb(59, 130, 246)',
        'rgb(16, 185, 129)',
        'rgb(245, 158, 11)',
        'rgb(239, 68, 68)'
      ]
    }]
  };
  
  public barChartType: ChartType = 'bar';
  public lineChartType: ChartType = 'line';
  public pieChartType: ChartType = 'pie';

  // Update chart data based on loaded stats
  private updateChartData() {
    // Update line chart (7-day trend)
    this.lineChartData = {
      labels: this.chartData.map(d => d.date),
      datasets: [{
        label: 'Clicks',
        data: this.chartData.map(d => d.clicks),
        borderColor: 'rgb(95, 66, 240)',
        backgroundColor: 'rgba(95, 66, 240, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    };
  
    // Update bar chart (top countries)
    this.barChartData = {
      labels: this.topCounties.map(c => c.country),
      datasets: [{
        label: 'Clicks',
        data: this.topCounties.map(c => c.count),
        backgroundColor: 'rgb(95, 66, 240)',
        borderRadius: 8
      }]
    };
  
    // Update pie chart (device stats)
    this.pieChartData = {
      labels: this.deviceStats.map(d => d.name),
      datasets: [{
        data: this.deviceStats.map(d => d.value),
        backgroundColor: [
          'rgb(95, 66, 240)',
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)'
        ]
      }]
    };
  }

  // Export to PDF/CSV
  get exportData(): ExportData {
    if (!this.stats) {
      throw new Error('Stats not available for export');
    }

    return {
      shortUrl: this.shortUrl,
      originalUrl: this.stats.original_url,
      clicks: this.stats.clicks,
      avgClicksPerDay: this.avgClicksPerDay,
      createdDate: this.createdDate,
      shortCode: this.stats.short_code,
      chartData: this.chartData,
      topCountries: this.topCounties,
      deviceStats: this.deviceStats,
      browserStats: this.browserStats,
      recentClicks: this.recentClicks,
      formatDistanceToNow: this.formatDistanceToNow.bind(this)
    };
  }

  async exportToPDF(): Promise<void> {
    if (!this.stats) return;
    await this.exportService.exportToPDF(this.exportData);
  }

  exportToCSV(): void {
    if (!this.stats) return;
    this.exportService.exportToCSV(this.exportData);
  }
}
