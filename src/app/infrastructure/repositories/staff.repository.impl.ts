import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Staff, CreateStaffRequest } from '../../shared/models/staff.model';
import { API_ENDPOINTS } from '../../shared/config/api-endpoints.config';

@Injectable({
  providedIn: 'root'
})
export class StaffRepositoryImpl {

  constructor(private http: HttpClient) {}

  getStaff(): Observable<Staff[]> {
    console.log('👥 Fetching staff from:', API_ENDPOINTS.STAFF.LIST);
    return this.http.get<any[]>(API_ENDPOINTS.STAFF.LIST).pipe(
      map(apiStaff => {
        console.log('✅ Staff received:', apiStaff);
        return apiStaff.map(staff => this.mapApiStaffToStaff(staff));
      }),
      catchError(error => {
        console.error('❌ Error fetching staff:', error);
        return of([]);
      })
    );
  }

  getStaffById(id: number): Observable<Staff> {
    const url = `${API_ENDPOINTS.STAFF.LIST}/${id}`;
    console.log('👥 Fetching staff by ID from:', url);

    return this.http.get<any>(url).pipe(
      map(apiStaff => {
        console.log('✅ Staff member received:', apiStaff);
        return this.mapApiStaffToStaff(apiStaff);
      }),
      catchError(error => {
        console.error('❌ Error fetching staff member:', error);
        throw error;
      })
    );
  }

  createStaff(request: CreateStaffRequest): Observable<Staff> {
    console.log('🆕 Creating new staff member:', request);

    return this.http.post<any>(API_ENDPOINTS.STAFF.CREATE, request).pipe(
      map(response => {
        console.log('✅ Staff member created:', response);
        return this.mapApiStaffToStaff(response);
      }),
      catchError(error => {
        console.error('❌ Error creating staff member:', error);
        throw error;
      })
    );
  }

  updateStaff(id: number, updates: Partial<Staff>): Observable<Staff> {
    const url = API_ENDPOINTS.STAFF.UPDATE(id.toString());
    console.log('🔄 Updating staff member:', id, updates);

    return this.http.put<any>(url, updates).pipe(
      map(response => {
        console.log('✅ Staff member updated:', response);
        return this.mapApiStaffToStaff(response);
      }),
      catchError(error => {
        console.error('❌ Error updating staff member:', error);
        throw error;
      })
    );
  }

  deleteStaff(id: number): Observable<void> {
    const url = API_ENDPOINTS.STAFF.DELETE(id.toString());
    console.log('🗑️ Deleting staff member:', id);

    return this.http.delete<void>(url).pipe(
      map(() => {
        console.log('✅ Staff member deleted successfully');
      }),
      catchError(error => {
        console.error('❌ Error deleting staff member:', error);
        throw error;
      })
    );
  }

  private mapApiStaffToStaff(apiStaff: any): Staff {
    return {
      id: apiStaff.id,
      name: apiStaff.name,
      employeeStatus: apiStaff.employeeStatus,
      campaignId: apiStaff.campaignId
    };
  }
}
