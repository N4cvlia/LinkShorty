import { Component } from '@angular/core';
import { Auth } from '../../Services/auth';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email: string = '';
  password: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: Auth,
    private router: Router
  ){
    window.scrollTo(0,0);
  }

  async onSubmit() {
    if(!this.email.trim() || !this.email.includes('@')){
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    if(!this.password) {
      this.errorMessage = 'Please enter your password.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const { error } = await this.authService.signIn(this.email, this.password);

      if(error) {
        if(error.message.includes('Invalid login credentials')) {
          this.errorMessage = 'Invalid email or password'
        }else {
          this.errorMessage = error.message;
        }
      }else {
        this.router.navigate(['/']);
      }
    }catch (err) {
      this.errorMessage = 'An unexpected error occurred.';
      console.error('Login error:', err);
    } finally {
      this.loading = false;
    }
  }
}
