import { Component, OnInit, signal } from '@angular/core';
import { SupabaseService } from './Services/supabase';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [FormsModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App{
  protected readonly title = signal('link-shortener');
  
}
