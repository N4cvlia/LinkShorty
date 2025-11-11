import { Injectable } from '@angular/core';
import { Session, User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupabaseService } from './supabase';
import { ToastService } from './toast-service';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private currentUser$ = new BehaviorSubject<User | null>(null);
  private currentSession$ = new BehaviorSubject<Session | null>(null);

  constructor(
    private supabaseService: SupabaseService,
    private toast: ToastService
  ) {
    this.supabaseService.onAuthStateChange((event, session) => {
      if(event === 'SIGNED_OUT') {
        this.currentSession$.next(null);
        this.currentUser$.next(null);
      }else if(event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        toast.default('Welcome back!');
        this.currentSession$.next(session);
        this.currentUser$.next(session?.user ?? null);
      }
    });

    this.supabaseService.getSession().then(({ data: { session } }) => {
      this.currentSession$.next(session);
      this.currentUser$.next(session?.user ?? null);
    });
  }

  get user$(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

  get session$(): Observable<Session | null> {
    return this.currentSession$.asObservable();
  }

  get currentUser(): User | null {
    return this.currentUser$.value;
  }

  async signUp(firstName: string, lastName: string, phone: string, email: string, password: string) {
    return await this.supabaseService.signUp(firstName,lastName,phone,email, password);
  }

  async signIn(email: string, password: string) {
    return await this.supabaseService.signIn(email, password);
  }

  async signOut() {
    const result = await this.supabaseService.signOut();

    this.currentSession$.next(null);
    this.currentUser$.next(null);
    return result;
  }
}
