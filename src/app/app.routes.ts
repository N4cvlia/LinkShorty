import { RouterModule, Routes } from '@angular/router';
import { App } from './app';
import { Redirect } from './Pages/Redirect/redirect/redirect';
import { Home } from './Pages/Home/home/home';
import { Stats } from './Pages/Stats/stats/stats';

export const routes: Routes = [
    { path: '', component: Home },
    { path: ':shortCode', component: Redirect },
    { path: 'stats/:token', component: Stats },
    { path: '**', redirectTo: '' }
];