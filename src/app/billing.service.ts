import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BillingService {
  getManager() {
    throw new Error('Method not implemented.');
  }
 
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
  updateBusiness(id:string, value: any) {
    return this.http.put(`${this.baseUrl}/business/businessupdate/${id}`,value)
  }
  deleteBusiness(Id: string) {
    return this.http.delete(`${this.baseUrl}/business/businessdelete/${Id}`)
  }

   deleteAdmin(id: string) {
    return this.http.delete(`${this.baseUrl}/admin/admindelete/${id}`)
  }
  updateAdmin(id: string, value: any) {
return this.http.put(`${this.baseUrl}/admin/adminupdate/${id}`,value)
  }
  addAdmins(data: any) {
return this.http.post(`${this.baseUrl}/admin/adminregistration`,data)  }
  getAdmins() {
    return this.http.get<any[]>(`${this.baseUrl}/admin/adminget`)
  }
}
