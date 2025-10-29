import { bootstrapApplication } from '@angular/platform-browser';
import { environment } from './environments/environment';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Global handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  const message = event.reason?.message || '';
  if (message.includes('NavigatorLock') || message.includes('Lock') || message.includes('auth-token')) {
    event.preventDefault();
    return;
  }
});

// Also patch console.error for any that slip through
const originalError = console.error;
console.error = (...args: any[]) => {
  const msg = args.join(' ');
  if (msg.includes('NavigatorLock') || msg.includes('Lock')) return;
  originalError.apply(console, args);
};

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
