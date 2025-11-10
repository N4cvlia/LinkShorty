import { Component, OnInit, signal } from '@angular/core';
import { SupabaseService } from './Services/supabase';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Navigation } from "./Components/navigation/navigation";
import { NgChartsConfiguration } from 'ng2-charts';
import { ToastComponent } from "./Components/toast/toast";

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    RouterOutlet,
    Navigation,
    ToastComponent
],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App{
  protected readonly title = signal('link-shortener');
  
}
