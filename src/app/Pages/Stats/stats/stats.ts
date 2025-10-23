import { Component, OnInit } from '@angular/core';
import { UrlStats } from '../../../Interfaces/url-stats';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../../../Services/supabase';
import { StatsResolveData } from '../../../Interfaces/stats-resolve-data';

@Component({
  selector: 'app-stats',
  imports: [],
  templateUrl: './stats.html',
  styleUrl: './stats.css'
})
export class Stats implements OnInit{
  loading = false;
  closed = true;
  stats: UrlStats | null = null;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private supabaseService: SupabaseService,
    private router: Router
  ){}

  async ngOnInit(){
    // await this.loadStats();
    const resolvedData: StatsResolveData = this.route.snapshot.data['statsData'];

    this.stats = resolvedData.stats;
    this.error = resolvedData.error;
  }

  // private async loadStats(){
  //   const token = this.route.snapshot.paramMap.get('token');

  //   if(!token){
  //     this.error = 'Invalid stats link';
  //     this.loading = false;
  //     return;
  //   }

  //   const { data, error } = await this.supabaseService.getStatsByToken(token);

  //   this.stats = data;
  //   this.error = error;
  //   this.loading = false;
  // }

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

  goHome() {
    this.router.navigate(['/']);
  }
  closeIt() {
    this.closed = !this.closed;
  }
}
