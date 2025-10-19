import { RouterModule, Routes } from '@angular/router';
import { App } from './app';
import { Redirect } from './Redirect/redirect/redirect';
import { Home } from './Home/home/home';

export const routes: Routes = [
    { path: '', component: Home },
    { path: ':shortCode', component: Redirect }
];