import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { Subscription } from 'rxjs';
import { Auth } from '../../Services/auth';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation',
  imports: [CommonModule, RouterLink],
  templateUrl: './navigation.html',
  styleUrl: './navigation.css'
})
export class Navigation implements OnInit, OnDestroy{
  user: User | null = null;
  private userSubscription?: Subscription;

  constructor(
    private authService: Auth,
    private router: Router
  ) { }

  ngOnInit(){
    this.userSubscription = this.authService.user$.subscribe(user => {
      this.user = user;
    })
  }
  ngOnDestroy(){
    this.userSubscription?.unsubscribe();
  }

  async logout() {
    const { error } = await this.authService.signOut();

    if(!error) {
      this.router.navigate(['/']);
    }
  }

  navigateToAuth() {
    this.router.navigate(['/login']);
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
