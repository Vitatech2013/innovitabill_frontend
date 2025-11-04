import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BusinessService } from '../business.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
roles: string[] = ['Admin', 'Manager', 'Cashier'];

users: any;
usersForm!: FormGroup;
title: any;
  selectedUserId: string | null = null;
  logoFile: File | null = null;

constructor(private service:BusinessService ,private fb:FormBuilder){}

ngOnInit(): void {
this.usersForm = this.fb.group({
  full_name: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  phone_number: ['', Validators.required],
 role: ['', Validators.required],
    business_id: ['', Validators.required],
 
  address: this.fb.group({
    house_No: ['', Validators.required],
    town_Name: ['', Validators.required],
    mandal_Name: ['', Validators.required],
    district_Name: ['', Validators.required],
    state: ['', Validators.required],
    pincode: ['', Validators.required],
  }),
  password: ['', Validators.required],
  
});
  this.getUsers()
}
getUsers(){
  this.service.getUsers().subscribe(data => {
      this.users = data;
      console.log("users List");
      
    });
  }

  

openAddModal() {
 this.title = 'Add User';
 this.resetForm();
}
  resetForm() {
    this.usersForm.reset();
    this.selectedUserId = null;
    this.logoFile = null;
  }

edit(user: any) {
  this.selectedUserId= user._id;
  this.title= 'Edit User';
  this.usersForm.controls['full_name'].setValue(user.full_name);
  this.usersForm.controls['email'].setValue(user.email);
  this.usersForm.controls['phone_number'].setValue(user.phone_number);
  this.usersForm.patchValue({
    full_name: user.full_name,
    email: user.email,
    phone_number: user.phone_number,
    
    password: '',
    business_id: user.business_id,
    address: {
      house_No: user.address?.house_No || '',
      town_Name: user.address?.town_Name || '',
      mandal_Name: user.address?.mandal_Name || '',
      district_Name: user.address?.district_Name || '',
      state: user.address?.state || '',
      pincode: user.address?.pincode || '',
    }
  });
  this.usersForm.controls['password'].setValue('');

  this.logoFile= null;
}  
onLogoChange(event: any) {
  this.logoFile = event.target.files[0];
}

delete(id: string) {
  if (!confirm('Are you sure you want to delete this user?')) return;
  this.service.deleteUser(id).subscribe({
    next: () => {
      alert('User deleted successfully');
      this.getUsers();
    },
    error: (err) => console.error('Delete error', err)
  });
}



createOrUpdateUser() {
 if(this.usersForm.invalid) return;

 const formData= new FormData();
 formData.append('full_name', this.usersForm.get('full_name')?.value);
    formData.append('email', this.usersForm.get('email')?.value);
    formData.append('phone_number', this.usersForm.get('phone_number')?.value);
formData.append('address', JSON.stringify(this.usersForm.get('address')?.value));
    formData.append('password', this.usersForm.get('password')?.value);

    if (this.logoFile) formData.append('image', this.logoFile);

        if (this.selectedUserId) {
      // Update
      this.service.updateUser(this.selectedUserId, formData).subscribe({
        next: () => {
          alert('User updated successfully');
          this.getUsers();
          this.resetForm();
        },
        error: (err) => console.error('Update error', err)
      });
    } else {
      // Add
      this.service.createUser(formData).subscribe({
        next: () => {
          alert('User added successfully');
          this.getUsers();
          this.resetForm();
        },
        error: (err) => console.error('Create error', err)
      });
    }
}
 
  }

 
      
    