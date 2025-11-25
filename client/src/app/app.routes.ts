import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'transactions',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then(m => m.Login),
        canActivate: [guestGuard]
    },
    {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register').then(m => m.Register),
        canActivate: [guestGuard]
    },
    {
        path: 'no-access',
        loadComponent: () => import('./features/auth/no-access/no-access.component').then(m => m.NoAccessComponent)
    },
    {
        path: 'transactions',
        loadComponent: () => import('./features/transactions/pages/transaction-page/transaction').then(m => m.TransactionPageComponent),
        canActivate: [authGuard]
    }
];
