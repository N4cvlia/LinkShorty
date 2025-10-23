import { RouterModule, Routes } from '@angular/router';
import { App } from './app';
import { Redirect } from './Pages/Redirect/redirect/redirect';
import { Home } from './Pages/Home/home/home';
import { Stats } from './Pages/Stats/stats/stats';
import { statsResolver } from './Resolvers/stats-resolver';

export const routes: Routes = [
    { path: '', component: Home },
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