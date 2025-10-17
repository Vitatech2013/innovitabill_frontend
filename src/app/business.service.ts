import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  createUser(userData: any) {
    throw new Error('Method not implemented.');
  }
  deleteUser(id: string) {
    throw new Error('Method not implemented.');
  }
  updateUser(selectedUserId: string, userData: any) {
    throw new Error('Method not implemented.');
  }
  getUsers() {
    throw new Error('Method not implemented.');
  }
 
  
  private baseUrl = 'http://localhost:1001/business';

  constructor(private http: HttpClient) { }

  login(data: any){
    return this.http.post(`${this.baseUrl}/businesslogin`,data)
  }

  

  
}
