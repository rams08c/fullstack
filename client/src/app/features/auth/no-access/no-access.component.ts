import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-no-access',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './no-access.component.html',
    styleUrl: './no-access.component.css'
})
export class NoAccessComponent {
    private router = inject(Router);

    goToLogin(): void {
        this.router.navigate(['/login']);
    }
}
