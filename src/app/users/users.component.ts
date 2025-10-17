import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
viewBusiness(_t18: any) {
throw new Error('Method not implemented.');
}
deleteBusiness(_t18: any) {
throw new Error('Method not implemented.');
}
editBusiness(_t18: any) {
throw new Error('Method not implemented.');
}
users: any;
businesses: any;
addBusiness() {
throw new Error('Method not implemented.');
}
posts: any;
createuser() {
throw new Error('Method not implemented.');
}
adduser() {
throw new Error('Method not implemented.');
}
  BusinessForm!: FormGroup;
  business: any;




}
