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
    return this.http.post(`${this.baseUrl}/user/userregistration`, userData);
  }
  deleteUser(id: string) {
    return this.http.delete(`${this.baseUrl}/user/userdelete//${id}`);
  }
  updateUser(id: string, data: any) {
    return this.http.put(`${this.baseUrl}/user/updateuser/${id}`, data);
  }
  getUsers() {
    return this.http.get(`${this.baseUrl}/user/getuser`);
  }


}

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class BusinessService {

//   private baseUrl = 'http://localhost:3003';

//   constructor(private http: HttpClient) {}

//   login(data: any) {
//     return this.http.post(`${this.baseUrl}/business/businesslogin`, data);
//   }

//   getUsers(): Observable<any> {
//     return this.http.get(`${this.baseUrl}/user/getuser`);
//   }

//   createUser(formData: FormData): Observable<any> {
//     return this.http.post(`${this.baseUrl}/user/userregistration`, formData);
//   }

//   updateUser(id: string, formData: FormData): Observable<any> {
//     return this.http.put(`${this.baseUrl}/user/updateuser/${id}`, formData);
//   }

 
//   deleteUser(id: string): Observable<any> {
//     return this.http.delete(`${this.baseUrl}/user/userdelete/${id}`);
//   }
// getUsersByBusinessId(businessId: string) {
//   return this.http.get(`http://localhost:3003/business/users/${businessId}`);
// }
  
// }

