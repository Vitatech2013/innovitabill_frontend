import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constants } from '../../constants';

@Injectable({
  providedIn: 'root',
})
export class BusinessService {
  private baseUrl = constants.baseUrl;

  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post(`${this.baseUrl}/business/businesslogin`, data);
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

  createUser(userData: any) {
    return this.http.post(`${this.baseUrl}/user/userregistration`, userData);
  }
  deleteUser(id: string) {
    return this.http.delete(`${this.baseUrl}/user/userdelete/${id}`);
  }
updateUser(id: string, payload: any) {
  return this.http.put(`${this.baseUrl}/user/updateuser/${id}`, payload);
}

  getUser() {
    return this.http.get(`${this.baseUrl}/user/getuser`);
  }
}

