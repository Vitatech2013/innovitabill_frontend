import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  
  private baseUrl = 'http://localhost:1001/business';

  constructor(private http: HttpClient) { }

  login(data: any){
    return this.http.post(`${this.baseUrl}/businesslogin`,data)
  }

  createUser(userData: any) {
    return this.http.post(`${this.baseUrl}/businessregistration`, userData)
  }
  deleteUser(id: string) {
    return this.http.delete(`${this.baseUrl}/businessdelete/${id}`,)
  }
  updateUser(id: string, data: any) {
    return this.http.put(`${this.baseUrl}/businessupdate/${id}`,data)
  }
  getUsers() {
    return this.http.get(`${this.baseUrl}/businessget`);
  }
 

  
}





