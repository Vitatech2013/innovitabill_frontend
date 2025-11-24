import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BillingService {


  // private baseUrl = 'http://localhost:3009';
  private baseUrl = 'http://78.142.47.247:3009';
  constructor(private http: HttpClient) {}


  getSuperadminById(superadmin_id: string) {
    throw new Error('Method not implemented.');
  }

  deleteBusiness(deleteBusinessId: string) {
    throw new Error('Method not implemented.');
  }
  getAllBusiness() {
    throw new Error('Method not implemented.');
  }

 






  SuperAdminLogin(data: any) {
    return this.http.post(`${this.baseUrl}/superadmin/superadminlogin`, data);
  }

forgotPassword(data: any) {
  return this.http.post('http://78.142.47.247:3009/superadmin/forgotPassword', data);
}


 resetPassword(data: any, token: any){
  return this.http.post(`${this.baseUrl}/superadmin/resetPassword/${token}`, data);
}

  // business
  addBusiness(data: any) {
    return this.http.post(
      `${this.baseUrl}/business/businessregistration`,
      data
    );
  }
  getBusiness() {
    return this.http.get<any[]>(`${this.baseUrl}/business/businessget`);
  }
  updateBusiness(id: string, value: any) {
     return this.http.put(`${this.baseUrl}/business/businessupdate/${id}`, value);
  }
  deletebusiness(id: string) {
    return this.http.delete(`${this.baseUrl}/business/businessdelete/${id}`);
  }
   getBusinessprofile(id: any) {
    return this.http.get(`${this.baseUrl}/business/businessprofile/${id}`);
  }
  businessprofileupdate(formData: FormData, id: any) {
  return this.http.put(`${this.baseUrl}/business/businessupdate/${id}`, formData);
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

// b_types
// addBusinessType(data: any) {
//   return this.http.get(`${this.baseUrl}/btypes/addtypes`, data);
// }

// updateBusinessType(id: string, data: any) {
//  return this.http.get(`${this.baseUrl}/btypes/btypesupdate/${id}`, data);
// }
addBusinessType(data: any) {
  return this.http.post(`${this.baseUrl}/btypes/addtypes`, data);
}

updateBusinessType(id: string, data: any) {
  return this.http.put(`${this.baseUrl}/btypes/btypesupdate/${id}`, data);
}

 

  getAllBusinessTypes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/btypes/getbtypes`);
  }

  deleteBusinessType(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/btypes/btypesdelete/${id}`);
  }

// Demo
  sendDemoMail(data: any) {
  return this.http.post(`${this.baseUrl}/demo/demoregistration`, data);
}


  //Admins
  deleteAdmin(id: string) {
    return this.http.delete(`${this.baseUrl}/admindelete/${id}`);
  }
  updateAdmin(id: string, value: any) {
    return this.http.put(`${this.baseUrl}/admin/adminupdate/${id}`, value);
  }

  getAdmins() {
    return this.http.get<any[]>(`${this.baseUrl}/admin/adminget`);
  }

  //managers
  getManager() {
    return this.http.get<any[]>(`${this.baseUrl}/manager/managerget`);
  }

  //cashiers
  getCashiers() {
    return this.http.get<any[]>(`${this.baseUrl}/cashier/cashierget`);
  }

  //Roles

  getRoles() {
    return this.http.get(`${this.baseUrl}/role/getrole`);
  }
  addRole(newRole: any) {
    return this.http.post(`${this.baseUrl}/role/addrole`, newRole);
  }
  deleteRole(id: string) {
    return this.http.delete(`${this.baseUrl}/role/roledelete/${id}`);
  }
  //categories
  getcategories() {
    return this.http.get(`${this.baseUrl}/categories/categoriesget`);
  }
  deleteCategory(id: string) {
    return this.http.delete(
      `${this.baseUrl}/categories/categoriesdelete/${id}`
    );
  }
  addCategory(data: any) {
    return this.http.post(`${this.baseUrl}/categories/categoriesadd`, data);
  }
  updateCategory(id: string, value: any) {
    return this.http.put(
      `${this.baseUrl}/categories/categoriesupdate/${id}`,
      value
    );
  }

  cashierlogin(value?: any) {
    return this.http.get<any[]>(`${this.baseUrl}/cashier/cashierlogin`);
  }
  addUnit(unit: any) {
    return this.http.post(`${this.baseUrl}/units/unitsadd`, unit);
  }
  getUnits() {
    return this.http.get(`${this.baseUrl}/units/unitsget`);
  }
  updateUnit(id: string, data: any) {
    return this.http.put(`${this.baseUrl}/units/unitsupdate/${id}`, data);
  }
  deleteUnit(id: string) {
    return this.http.delete(`${this.baseUrl}/units/unitsdelete/${id}`);
  }

  //users

  UserLogin(data: any) {
    return this.http.post(`http://localhost:3009/user/userlogin`, data);
  }

  getItems(Business_id: any): Observable<any> {
    return this.http.get(`http://localhost:3009/items/getitems`);
  }

  addItems(formData: FormData) {
    return this.http.post(`http://localhost:3009/items/additems`, formData);
  }

  getCategories(Business_id: string) {
    return this.http.get(`http://localhost:3009/categories/categoriesget`);
  }
  getSubCategories() {
    return this.http.get(`http://localhost:3009/subcat/getsubcat`);
  }
  getUsers(business_id: string) {
    return this.http.get(`http://localhost:3009/user/getuser`);
  }

  saleslist(): Observable<any> {
    return this.http.get(`http://localhost:3009/sales/getSales`);
  }

  savesale(data: any) {
    return this.http.post(`http://localhost:3009/sales/createsale`, data);
  }

  updateitems(id: any, data: any) {
    return this.http.put(`http://localhost:3009/items/updateitems/${id}`, data);
  }
  deleteItem(id: String) {
    return this.http.delete(`http://localhost:3009/items/deleteitems/${id}`);
  }

  updateprofile(formData: FormData, id: string) {
    return this.http.put(`${this.baseUrl}/user/updateuser/${id}`, formData);
  }
  getuserprofile(id: string) {
    return this.http.get(`${this.baseUrl}/user/userprofile/${id}`);
  }
  getStatusTypes() {
    return this.http.get(`${this.baseUrl}/status/getstatus`);
  }
  getSalesReport(){
    return this.http.get(`${this.baseUrl}/sales/getSalesReport`)
  }
}
