import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BusinessService {
  
  private baseUrl = 'http://localhost:3003';

  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post(`${this.baseUrl}/business/businesslogin`, data);
  }

  createUser(userData: any) {
    return this.http.post(`${this.baseUrl}/adminregistration`, userData);
  }
  deleteUser(id: string) {
    return this.http.delete(`${this.baseUrl}/admindelete/${id}`);
  }
  updateUser(id: string, data: any) {
    return this.http.put(`${this.baseUrl}/adminupdate/${id}`, data);
  }
  getUsers() {
    return this.http.get(`${this.baseUrl}/adminget`);
  }
  getUsersByBusinessId(businessId: string) {
  return this.http.get(`http://localhost:3003/business/users/${businessId}`);
}

}
