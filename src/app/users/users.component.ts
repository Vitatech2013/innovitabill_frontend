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

  usersForm!: FormGroup;
  users: any[] = [];
  selectedUserId: string | null = null;
  title: string = 'Add User';

  // Individual file variables
  logoFile: File | null = null;
  

  constructor(private fb: FormBuilder, private service: BusinessService) {}

  ngOnInit(): void {
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
      superadmin_id: ['', Validators.required],
    });
    this.getAllUsers();
  }



  // Get all users
getAllUsers() {
  const businessData = localStorage.getItem('businessToken');

  if (!businessData) {
    console.error('No business token found in localStorage');
    return;
  }

  let businessId: string | null = null;

  try {
    const parsedData = JSON.parse(businessData);
    businessId = parsedData._id || parsedData.businessId || parsedData.id || null; // adjust key based on your backend response
  } catch (err) {
    console.error('Error parsing business data:', err);
  }

  if (!businessId) {
    console.error('Business ID not found inside localStorage data');
    return;
  }

  // 🔹 Call service with businessId
  this.service.getUsersByBusinessId(businessId).subscribe({
    next: (res: any) => {
      this.users = res;
      console.log('Users for business:', businessId, res);
    },
    error: (err: any) => {
      console.error('Error fetching users', err);
    },
  });
}


  // Open Add modal
  openAddModal() {
    this.title = 'Add User';
    this.resetForm();
  }

  // Edit user
  edit(user: any) {
    this.selectedUserId = user._id;
    this.title = 'Edit User';

    this.usersForm.controls['business_name'].setValue(user.business_name);
    this.usersForm.controls['owner_name'].setValue(user.owner_name);
    this.usersForm.controls['email'].setValue(user.email);
    this.usersForm.controls['phone_number'].setValue(user.phone_number);
    this.usersForm.controls['business_type'].setValue(user.business_type);
    this.usersForm.controls['business_address'].setValue(user.business_address);
    this.usersForm.controls['registration_number'].setValue(user.registration_number);
    this.usersForm.controls['gst_number'].setValue(user.gst_number);
    this.usersForm.controls['password'].setValue(''); // blank for security
    this.usersForm.controls['superadmin_id'].setValue(user.superadmin_id);

    // Reset files for edit
    this.logoFile = null;
  
  }

  // File change handlers
  onLogoChange(event: any) { this.logoFile = event.target.files[0]; }
  
  // Submit form
  createOrUpdateUser() {
    if (this.usersForm.invalid) return;

    const formData = new FormData();
    formData.append('business_name', this.usersForm.get('business_name')?.value);
    formData.append('owner_name', this.usersForm.get('owner_name')?.value);
    formData.append('email', this.usersForm.get('email')?.value);
    formData.append('phone_number', this.usersForm.get('phone_number')?.value);
    formData.append('business_type', this.usersForm.get('business_type')?.value);
    formData.append('business_address', this.usersForm.get('business_address')?.value);
    formData.append('registration_number', this.usersForm.get('registration_number')?.value);
    formData.append('gst_number', this.usersForm.get('gst_number')?.value);
    formData.append('password', this.usersForm.get('password')?.value);
    formData.append('superadmin_id', this.usersForm.get('superadmin_id')?.value);

    if (this.logoFile) formData.append('logo_image', this.logoFile);
   
    if (this.selectedUserId) {
      // Update
      this.service.updateUser(this.selectedUserId, formData).subscribe({
        next: () => {
          alert('User updated successfully');
          this.getAllUsers();
          this.resetForm();
        },
        error: (err) => console.error('Update error', err)
      });
    } else {
      // Add
      this.service.createUser(formData).subscribe({
        next: () => {
          alert('User added successfully');
          this.getAllUsers();
          this.resetForm();
        },
        error: (err) => console.error('Create error', err)
      });
    }
  }

  // Delete user
  delete(id: string) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    this.service.deleteUser(id).subscribe({
      next: () => {
        alert('User deleted successfully');
        this.getAllUsers();
      },
      error: (err) => console.error('Delete error', err)
    });
  }

  // Reset form
  resetForm() {
    this.usersForm.reset();
    this.selectedUserId = null;
    this.logoFile = null;
    
  }
}
