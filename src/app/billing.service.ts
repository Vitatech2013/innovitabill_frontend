import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BillingService {
 
  private baseUrl='http://localhost:1001';

  constructor(private http:HttpClient) { }

   SuperAdminLogin(data: any) {
    return this.http.post(`${this.baseUrl}/superadmin/superadminlogin`,data)
  }
}
