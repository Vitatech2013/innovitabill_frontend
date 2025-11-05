import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BillingService {
  getAllBusiness() {
    throw new Error('Method not implemented.');
  }
 
  private baseUrl='http://localhost:3003';

  constructor(private http:HttpClient) { }

  SuperAdminLogin(data: any) {
    return this.http.post(`${this.baseUrl}/superadmin/superadminlogin`,data)
    }
  addBusiness(data:any) {
    return this.http.post(`${this.baseUrl}/business/businessregistration`,data);
    }
  getBusiness() {
    return this.http.get<any[]>(`${this.baseUrl}/business/businessget`)
    }
  updateBusiness(id:string, value: any) {
    return this.http.put(`${this.baseUrl}/business/businessupdate/${id}`,value)
  }
  deletebusiness(Id: string) {
    return this.http.delete(`${this.baseUrl}/business/businessdelete/${Id}`)
  }
//Admins
  deleteAdmin(id: string) {
    return this.http.delete(`${this.baseUrl}/admindelete/${id}`);
  }
  updateAdmin(id: string, value: any) {
    return this.http.put(`${this.baseUrl}/admin/adminupdate/${id}`,value)
  }
 
  getAdmins() {
    return this.http.get<any[]>(`${this.baseUrl}/admin/adminget`)
  }

//managers
   getManager() {
    return this.http.get<any[]>(`${this.baseUrl}/manager/managerget`)
  }

//cashiers
  getCashiers() {
  return this.http.get<any[]>(`${this.baseUrl}/cashier/cashierget`)
  }


//Roles  

getRoles() {
    return this.http.get(`${this.baseUrl}/role/getrole`);
  }

// casher_login
cashierlogin(value?: any){
  return this.http.get<any[]>(`${this.baseUrl}/cashier/cashierlogin`)
}
}

