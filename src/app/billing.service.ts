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
  addBusiness(data:any) {
    return this.http.post(`${this.baseUrl}/business/businessadd`,data);
    }
  getBusiness() {
    return this.http.get<any[]>(`${this.baseUrl}/business/businessget`)
    }
  updateBusiness(businessid:string, value: any) {
    return this.http.put(`${this.baseUrl}/business/businessupdate/${businessid}`,value)
  }
  deleteBusiness(deleteBusinessId: string) {
    return this.http.delete(`${this.baseUrl}/business/businessdelete/${deleteBusinessId}`)
  }
}
