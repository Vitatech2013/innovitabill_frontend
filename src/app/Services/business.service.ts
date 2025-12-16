import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constants } from '../../../constants';


@Injectable({
  providedIn: 'root',
})
export class BusinessService {

  private baseUrl = constants.baseUrl;

  constructor(private http: HttpClient) {}

  businessLogin(data: any) {
    return this.http.post(`${this.baseUrl}/business/login`, data);
  }
 businessForgotpassword(data: any) {
    return this.http.post(
      `${this.baseUrl}/business/forgotPassword`,
      data
    );
  }

  businessResetPassword(data: any, token: any) {
    return this.http.post(
      `${this.baseUrl}/business/resetPassword/${token}`,
      data
    );
  }

//   createUser(userData: any) {
//     return this.http.post(`${this.baseUrl}/user/userregistration`, userData);
//   }
//   deleteUser(id: string) {
//     return this.http.delete(`${this.baseUrl}/user/userdelete/${id}`);
//   }
// //   updateUser(selectedUser: any, payload: any) {
// //   return this.http.put(`user/updateuser/${selectedUser._id}`, payload);
// // }
// updateUser(selectedUser: any, userdata: any) {
//   return this.http.put(`http://localhost:3009/user/updateuser/${selectedUser._id}`,userdata);
// }

//   getUser() {
//     return this.http.get(`${this.baseUrl}/user/getuser`);
//   }

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
   addUser(formData: FormData) {
     return this.http.post(`${this.baseUrl}/user/registration`, formData);
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

//   createUser(userData: any) {
//     return this.http.post(`${this.baseUrl}/user/registration`, userData);
//   }
//   deleteUser(id: string) {
//     return this.http.delete(`${this.baseUrl}/user/delete/${id}`);
//   }
// updateUser(id: string, payload: any) {
//   return this.http.put(`${this.baseUrl}/user/update/${id}`, payload);
// }

//   getUser() {
//     return this.http.get(`${this.baseUrl}/user/get`);
//   }
}

