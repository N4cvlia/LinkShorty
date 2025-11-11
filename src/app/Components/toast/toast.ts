import { Component } from '@angular/core';
import { ToastService } from '../../Services/toast-service';
import { Observable } from 'rxjs';
import { Toast } from '../../Interfaces/toast';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css'
})
export class ToastComponent {
  constructor(private toastService: ToastService) {}

  get toasts$() {
    return this.toastService.toasts$;
  }
  
  getToastClass(variant?: string): string {
    const baseClass = 'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md p-2 pr-6 shadow-lg transition-all';
    
    switch (variant) {
      case 'success':
        return `${baseClass} bg-green-600 text-white border-green-700`;
      case 'destructive':
        return `${baseClass} bg-white text-foreground border-gray-300`;
      default:
        return `${baseClass} bg-white text-foreground border-gray-300`;
    }
  }

  getToastState(toast: any): string {
    return 'open';
  }

  dismiss(id: string) {
    this.toastService.dismiss(id);
  }
}
