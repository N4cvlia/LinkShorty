import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../../../Services/supabase';


@Component({
  selector: 'app-redirect',
  imports: [],
  templateUrl: './redirect.html',
  styleUrl: './redirect.css'
})
export class Redirect implements OnInit{
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supabaseService: SupabaseService
  ) {}

  async ngOnInit() {
    const shortCode = this.route.snapshot.paramMap.get('shortCode');

    if (!shortCode) {
      this.router.navigate(['/']);
      return;
    }

    try {
      console.log('Fetching URL for:', shortCode); 
      const data = await this.supabaseService.getUrlByShortCode(shortCode);
      console.log('Got data:', data);

      this.supabaseService.incrementClicks(shortCode);

      window.location.href = data?.original_url;
    } catch (err) {
      console.error('Redirect error:', err);
      this.error = 'Short URL not found.';
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 3000);
    }
  }

}
