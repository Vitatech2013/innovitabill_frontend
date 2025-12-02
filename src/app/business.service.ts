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

  createUser(userData: any) {
    return this.http.post(`${this.baseUrl}/user/userregistration`, userData);
  }
  deleteUser(id: string) {
    return this.http.delete(`${this.baseUrl}/user/userdelete/${id}`);
  }
  updateUser(id: string, data: any) {
    return this.http.put(`${this.baseUrl}/user/updateuser/${id}`, data);
  }
  getUsers() {
    return this.http.get(`${this.baseUrl}/user/getuser`);
  }
}
