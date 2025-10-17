import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BusinessService } from '../business.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {

  usersForm!: FormGroup;
  users: any[] = [];
  selectedUserId: string | null = null;


  constructor(private fb:FormBuilder,private service:BusinessService){}

  ngOnInit(): void {
    this.initForm();
    this.getAllUsers();
  }

  initForm() {
  this.usersForm = this.fb.group({
    business_name: ['', Validators.required],
    owner_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone_number: ['', Validators.required],
    business_type: ['', Validators.required],
    business_address: ['', Validators.required],
    registration_number: ['', Validators.required],
    gst_number: ['', Validators.required],
    password: ['', Validators.required],
    
    superadmin_id: ['', Validators.required]
  });
}


  getAllUsers() {
    this.service.getUsers().subscribe({
      next: (res: any) => {
        this.users = res;
      },
      error: (err: any) => {
        console.error('Error fetching users', err);
      }
    });
  }
edit(user: any) {
    this.selectedUserId = user._id;
    this.usersForm.patchValue({
      business_name: user.business_name,
      owner_name: user.owner_name,
      email: user.email,
      phone_number: user.phone_number,
      business_type: user.business_type,
      registration_number: user.registration_number,
      gst_number: user.gst_number,
      password: user.password,
      superadmin_id: user.superadmin_id,

    });


  }

  createuser() {
    if (this.usersForm.invalid) return;

    const userData = this.usersForm.value;

    if (this.selectedUserId) {
     
      this.service.updateUser(this.selectedUserId, userData).subscribe({
        next: (res:any) => {
          this.getAllUsers();
          this.resetForm();
          
        },
        error: (err: any) => {
          console.error(' Server error:', err);
          alert(err.error?.message || 'Something went wrong on the server!');
        },

      });
    } else {
    
      this.service.createUser(userData).subscribe({
        next: (res:any) => {
          this.getAllUsers();
          this.resetForm();
        },
        error: (err:any) => {
          console.error(err);
        },
      });
    }
  }

  delete(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.service.deleteUser(id).subscribe({
        next: (res: any) => {
          console.log(' User deleted:', res);
          alert('user deleted successful')
            this.users = this.users.filter(u => u._id !== id);
          this.getAllUsers();
        },
        error: (err: any) => {
          console.error(' Delete error:', err);
          alert('Server error while deleting user');
        },
      });
    
  
    }
  }
  resetForm() {
    this.usersForm.reset();
    this.selectedUserId = null;
  }
}