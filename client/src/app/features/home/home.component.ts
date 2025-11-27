import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        MatButtonModule,
        MatIconModule,
        MatCardModule
    ],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
    features = [
        {
            icon: 'account_balance_wallet',
            title: 'Track Expenses',
            description: 'Monitor your daily expenses and income with ease'
        },
        {
            icon: 'analytics',
            title: 'Financial Insights',
            description: 'Get detailed analytics and summaries of your spending'
        },
        {
            icon: 'category',
            title: 'Categorize Transactions',
            description: 'Organize transactions by custom categories'
        }
    ];
}
