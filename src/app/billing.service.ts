import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { constants } from '../../constants';
@Injectable({
  providedIn: 'root',
})
export class BillingService {
  // getQuotationData(demoId: string | null) {
  //   throw new Error('Method not implemented.');
  // }
  // private baseUrl = 'http://78.142.47.247:3009';
  private baseUrl = constants.baseUrl;
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
    return this.http.post(
      `${this.baseUrl}/superadmin/forgotPassword`,
      data
    );
  }

  resetPassword(data: any, token: any) {
    return this.http.post(
      `${this.baseUrl}/superadmin/resetPassword/${token}`,
      data
    );
  }

  // business
  addBusiness(data: any) {
    return this.http.post(
      `${this.baseUrl}/business/businessregistration`,
      data
    );
  }
  getBusiness(sid: any) {
    return this.http.get<any[]>(
      `${this.baseUrl}/business/businessgetbysuperadminid/${sid}`
    );
  }

  updateBusiness(id: string, value: any) {
    return this.http.put(
      `${this.baseUrl}/business/businessupdate/${id}`,
      value
    );
  }
  deletebusiness(id: string) {
    return this.http.delete(`${this.baseUrl}/business/businessdelete/${id}`);
  }
  getBusinessprofile(id: any) {
    return this.http.get(`${this.baseUrl}/business/businessprofile/${id}`);
  }
  businessprofileupdate(formData: FormData, id: any) {
    return this.http.put(
      `${this.baseUrl}/business/businessupdate/${id}`,
      formData
    );
  }

  profileupdate(formData: FormData, id: string) {
    return this.http.put(
      `${this.baseUrl}/superadmin/superadminupdate/${id}`,
      formData
    );
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
  updateRole(id: string, data: any) {
    return this.http.put(`${this.baseUrl}/role/roleupdate/${id}`, data);
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
  getUnits(business_id: string) {
    return this.http.get(`${this.baseUrl}/units/unitsget`);
  }
  updateUnit(id: string, data: any) {
    return this.http.put(`${this.baseUrl}/units/unitsupdate/${id}`, data);
  }
  deleteUnit(id: string) {
    return this.http.delete(`${this.baseUrl}/units/unitsdelete/${id}`);
  }

  //users

  LoginUser(data: any) {
    return this.http.post(`${this.baseUrl}/user/userlogin`, data);
  }

  getItems(Business_id: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/items/getitems`);
  }

  addItems(data: any) {
    return this.http.post(`${this.baseUrl}/items/additems`, data);
  }

  getCategories(business_id: string) {
    return this.http.get(`${this.baseUrl}/categories/categoriesget`);
  }
  //

  addSubcat(data: any) {
  return this.http.post(`${this.baseUrl}/subcat/addsubcat`, data);
}

 getSubCategories() {
  return this.http.get(`${this.baseUrl}/subcat/getsubcat`);
}
    updateSubcat(id: string, data: any) {
  // Use PUT and include the ID in the URL
  return this.http.put(`${this.baseUrl}/subcat/updatesubcat/${id}`, data);
}

   deleteSubCat(id: string) {
  return this.http.delete(`${this.baseUrl}/subcat/deletesubcat/${id}`);
}

  //
  getUsers(business_id: string) {
    return this.http.get(`${this.baseUrl}/user/getuser`);
  }

  saleslist(): Observable<any> {
    return this.http.get(`${this.baseUrl}/sales/getSales`);
  }

  savesale(data: any) {
    return this.http.post(`${this.baseUrl}/sales/createsale`, data);
  }

  updateitems(id: string, data: FormData) {
    return this.http.put(`${this.baseUrl}/items/updateitems/${id}`, data);
  }
  deleteItem(id: String) {
    return this.http.delete(`${this.baseUrl}/items/deleteitems/${id}`);
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
  getSalesReport() {
    return this.http.get(`${this.baseUrl}/sales/getSalesReport`);
  }
  updatesale(id: string, sale: any) {
    return this.http.put(`${this.baseUrl}/sales/salesupdate/${id}`, sale);
  }
  getQuotationData(demoId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/quotation/getQuotationData/${demoId}`);
  }
}
