import { RouterModule, Routes } from '@angular/router';
import { App } from './app';
import { Redirect } from './Pages/Redirect/redirect/redirect';
import { Home } from './Pages/Home/home/home';
import { Stats } from './Pages/Stats/stats/stats';
import { statsResolver } from './Resolvers/stats-resolver';
import { authGuard } from './Guards/auth-guard';

export const routes: Routes = [
    { path: '', component: Home },
    {
        path: 'login',
        loadComponent: () => import('./Pages/login/login').then(m => m.Login),
        canActivate: [authGuard]
    },
    {
        path: 'signup',
        loadComponent: () => import('./Pages/sign-up/sign-up').then(m => m.SignUp),
        canActivate: [authGuard]
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./Pages/Dashboard/dashboard/dashboard').then(m => m.Dashboard)
    },
    {
        path: ':shortCode',
        component: Redirect,
    },
    {
        path: 'stats/:token',
        loadComponent: () => import('./Pages/Stats/stats/stats').then(m => m.Stats),
        resolve: {
            statsData: statsResolver
        }
    },
    { path: '**', redirectTo: '' }
];