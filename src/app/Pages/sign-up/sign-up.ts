import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../Services/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  imports: [FormsModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css'
})
export class SignUp {
  firstName: string = '';
  lastName: string = '';
  phone : string = '';
  email: string = '';
  password: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private authService: Auth,
    private router: Router
  ){}

  async onSubmit() {
    if(!this.firstName.trim()) {
      this.errorMessage = 'Please enter your first name.';
      return;
    }

    if(!this.lastName.trim()) {
      this.errorMessage = 'Please enter your last name.';
      return;
    }

    if(!this.phone.trim()) {
      this.errorMessage = 'Please enter your phone number.';
      return;
    }

    if(!this.email.trim() || !this.email.includes('@')){
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    if(this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const { error } = await this.authService.signUp(this.firstName,this.lastName,this.phone,this.email, this.password);

      if(error) {
        if(error.message.includes('Email already registered.')) {
          this.errorMessage = 'This email is already registered. Please login instead.';
        }else {
          this.errorMessage = error.message;
        }
      }else {
        alert("Registration successful! Please check your email to verify your account.");
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      }
    }catch (err) {
      this.errorMessage = 'An unexpected error occurred.';
      console.error('Sign-up error:', err);
    } finally {
      this.loading = false;
    }
  } 
}
