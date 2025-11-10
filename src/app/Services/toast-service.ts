import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Toast } from '../Interfaces/toast';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  show(toast: Omit<Toast, 'id'>) {
    const id = Date.now().toString();
    const newToast = { ...toast, id };

    this.toastsSubject.next([...this.toastsSubject.value, newToast]);

    setTimeout(() => {
      this.dismiss(id)
    }, 3000);
  }

  dismiss(id: string) {
    this.toastsSubject.next(
      this.toastsSubject.value.filter(toast => toast.id !== id)
    );
  }

  success(title: string, description?: string) {
    this.show({ title, description, variant: 'success' });
  }

  error(title: string, description?: string) {
    this.show({ title, description, variant: 'destructive' });
  }
  default(title: string, description?: string) {
    this.show({ title, description, variant: 'default' });
  }
}
