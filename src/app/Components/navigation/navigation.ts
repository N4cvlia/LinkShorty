import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, viewChild } from '@angular/core';
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
  profileVisib: boolean = false;
  isScrolled: boolean = false;
  
  @ViewChild("profileDropdown") profileDropdown! : ElementRef;
  @HostListener("document:click", ['$event'])
  onDocumentClick(event : Event) {
    if(!this.profileDropdown.nativeElement.contains(event.target)) {
      this.profileVisib = false
    }
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 79.5;
  }

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
    this.profileVisib = false;
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
    this.profileVisib = false;
  }
  profileDrop(event: Event) {
    event.stopPropagation();
    this.profileVisib = !this.profileVisib
  }
}
