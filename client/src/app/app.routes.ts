import { Routes } from '@angular/router';


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'transactions',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
    },
    {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register').then(m => m.Register)
    },
    {
        path: 'transactions',
        loadComponent: () => import('./features/transactions/pages/transaction-page/transaction').then(m => m.TransactionPageComponent)
    }
];
