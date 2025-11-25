import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category, CategoriesListResponse, CategoryResponse } from '../models/category.model';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/categories`;

    /**
     * Get all categories
     */
    getCategories(): Observable<CategoriesListResponse> {
        return this.http.get<CategoriesListResponse>(this.apiUrl);
    }

    /**
     * Get category by ID
     */
    getCategoryById(id: number): Observable<CategoryResponse> {
        return this.http.get<CategoryResponse>(`${this.apiUrl}/${id}`);
    }
}
