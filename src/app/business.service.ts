import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BusinessService {
  private baseUrl = 'http://localhost:3009';
  // private baseUrl = 'http://78.142.47.247:3009';

  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post(`${this.baseUrl}/business/businesslogin`, data);
  }
  businessForgotpassword(email: string) {
    return this.http.post(
      'http://78.142.47.247:3009/forgotPassword',email);
  }
  businessResetPassword(data: any) {
    return this.http.post(
      'http:78.142.47.247:3009/business/resetPassword',
      data
    );
  }

  createUser(userData: any) {
    return this.http.post(`${this.baseUrl}/user/userregistration`, userData);
  }
  deleteUser(id: string) {
    return this.http.delete(`${this.baseUrl}/user/userdelete/${id}`);
  }
  updateUser(selectedUser: any, payload: any) {
  return this.http.put(`http://localhost:3009/user/updateuser/${selectedUser._id}`, payload);
}
  getUser() {
    return this.http.get(`${this.baseUrl}/user/getuser`);
  }
}

