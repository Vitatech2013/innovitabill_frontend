import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constants } from '../../../constants';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BusinessService {

 loading$ = new Subject<boolean>();

  showSpinner() {
    setTimeout(() => {
      this.loading$.next(true);
    });
  }

  hideSpinner() {
    setTimeout(() => {
      this.loading$.next(false);
    });
  }
  private baseUrl = constants.baseUrl;

  constructor(private http: HttpClient) {}

  businessLogin(data: any) {
    return this.http.post(`${this.baseUrl}/business/login`, data);
  }
  businessForgotpassword(data: any) {
    return this.http.post(`${this.baseUrl}/business/forgotPassword`, data);
  }

  businessResetPassword(data: any, token: any) {
    return this.http.post(
      `${this.baseUrl}/business/resetPassword/${token}`,
      data
    );
  }

  //Roles

  getRoles() {
    return this.http.get(`${this.baseUrl}/role/get`);
  }
  addRole(newRole: any) {
    return this.http.post(`${this.baseUrl}/role/add`, newRole);
  }
  updateRole(id: string, data: any) {
    return this.http.put(`${this.baseUrl}/role/update/${id}`, data);
  }

  deleteRole(id: string) {
    return this.http.delete(`${this.baseUrl}/role/delete/${id}`);
  }

  // users
  addUser(payload: FormData) {
    console.log('API payload sent');
    return this.http.post(`${this.baseUrl}/user/registration`, payload);
  }
  getUser() {
    return this.http.get(`${this.baseUrl}/user/get`);
  }
  updateUser(id: string, data: any) {
    return this.http.put(`${this.baseUrl}/user/update/${id}`, data);
  }

  deleteUser(id: string) {
    return this.http.delete(`${this.baseUrl}/user/delete/${id}`);
  }

  // bacnk details
// getBanksByUser(userId:any){
//   return this.http.get(`${this.baseUrl}/bankDetails/get?user_id=${userId}`);
// }
getBanksByUser(userId: any) {
  return this.http.get(
    `${this.baseUrl}/bankDetails/getBanksByUser/${userId}`
  );
}

addBank(data:any){
  return this.http.post(`${this.baseUrl}/bankDetails/add`, data);
}

updateBank(id:any,data:any){
  return this.http.put(`${this.baseUrl}/bankDetails/update/${id}`,data);
}

deleteBank(id:any){
  return this.http.delete(`${this.baseUrl}/bankDetails/delete/${id}`);
}
}
