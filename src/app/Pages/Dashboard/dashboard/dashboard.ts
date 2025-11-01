import { Component, OnInit } from '@angular/core';
import { UrlData } from '../../../Interfaces/url-data';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../Services/supabase';
import { formatDistanceToNow } from 'date-fns';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit{
  urls: UrlData[] = [];
  loading: boolean = true;
  currentHost = window.location.host;

  constructor(
    private router: Router,
    private supabaseService: SupabaseService
  ) {}

  async ngOnInit(){
    await this.checkAuthAndFetchUrls();
  }

  async checkAuthAndFetchUrls(){
    const session = await this.supabaseService.getSession();

    if(!session){
      alert("Pleasse login to view your links")
      this.router.navigate(['/login']);
      return;
    }
    
    await this.fetchUrls(session.data.session?.user.id!);
  }

  async fetchUrls(userId: string) {
    try {
      this.urls = await this.supabaseService.fetchUserUrls(userId);
    }catch(error){
      console.error("Error fetching URLs:", error);
      alert("There was an error fetching your URLs. Please try again later.");
    }finally{
      this.loading = false;
    }
  }

  copyToClipboard(shortCode: string) {
    const url = `${window.location.origin}/${shortCode}`;
    navigator.clipboard.writeText(url);
    alert(`Copied to clipboard!`);
  }

  viewStats(token: string) {
    this.router.navigate(['/stats', token], {
      state: { from: 'dashboard' }
    });
  }

  formatDate(dateString: string): string {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }
}
