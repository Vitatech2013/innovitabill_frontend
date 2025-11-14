import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillingService {
 
  getSuperadminById(superadmin_id: string) {
    throw new Error('Method not implemented.');
  }



  deleteBusiness(deleteBusinessId: string) {
    throw new Error('Method not implemented.');
  }
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
  deletebusiness(id: string) {
    return this.http.delete(`${this.baseUrl}/business/businessdelete/${id}`)
  }
profileupdate(formData: FormData, id: string) {
  return this.http.put(`${this.baseUrl}/superadmin/superadminupdate/${id}`, formData);
}
getadminprofile(id: string) {
  return this.http.get(`${this.baseUrl}/superadmin/superadminprofile/${id}`);
}
getBusinessTypes() {
    return this.http.get(`${this.baseUrl}/btypes/getbtypes`);
  }


getStatuses() {
    return this.http.get(`${this.baseUrl}/status/getstatus`);
  }


getDataFromBackend(): Observable<any> {
    // Make sure you return the observable from HttpClient
    return this.http.get('http://localhost:3003/your-endpoint');
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
  addRole(newRole:any) {
    return this.http.post(`${this.baseUrl}/role/addrole`,newRole);
  }
   deleteRole(id: string) {
    return this.http.delete(`${this.baseUrl}/role/roledelete/${id}`)
  }
//categories
  getcategories() {
    return this.http.get(`${this.baseUrl}/categories/categoriesget`)
  }
    deleteCategory(id: string) {
    return this.http.delete(`${this.baseUrl}/categories/categoriesdelete/${id}`)
  }
    addCategory(data: any) {
    return this.http.post(`${this.baseUrl}/categories/categoriesadd`,data);
  }
  updateCategory(id: string, value: any) {
    return this.http.put(`${this.baseUrl}/categories/categoriesupdate/${id}`,value)
  }

// casher_login
cashierlogin(value?: any){
  return this.http.get<any[]>(`${this.baseUrl}/cashier/cashierlogin`)
}
//units
  addUnit(unit: any) {
    return this.http.post(`${this.baseUrl}/units/unitsadd`,unit);
  }
  getUnits() {
    return this.http.get(`${this.baseUrl}/units/unitsget`)
  }
    updateUnit(id: string, data: any) {
    return this.http.put(`${this.baseUrl}/units/unitsupdate/${id}`,data)
  }
    deleteUnit(id: string) {
    return this.http.delete(`${this.baseUrl}/units/unitsdelete/${id}`)
  }
}


