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
}
