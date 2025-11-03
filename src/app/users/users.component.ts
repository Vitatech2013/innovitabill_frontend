import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BusinessService } from '../business.service';
import { BillingService } from '../billing.service';

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

  logoFile: File | null = null;
roles: any;
  

  constructor(private fb: FormBuilder, private service: BusinessService, private api:BillingService) {}

  ngOnInit(): void {
    this.usersForm = this.fb.group({
      full_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', Validators.required],
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
    this.getAllUsers();

    this.api.getRoles().subscribe((res:any)=>{
      this.roles=res;
      console.log(res,"Roles")
    })
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
    this.usersForm.controls['password'].setValue(''); // blank for security

    // Reset files for edit
    this.logoFile = null;
  
  }

  // File change handlers
  onLogoChange(event: any) { this.logoFile = event.target.files[0]; }
  
  // Submit form
  createOrUpdateUser() {
    if (this.usersForm.invalid) return;

    const formData = new FormData();
    formData.append('full_name', this.usersForm.get('full_name')?.value);
    formData.append('email', this.usersForm.get('email')?.value);
    formData.append('phone_number', this.usersForm.get('phone_number')?.value);
    formData.append('address', this.usersForm.get('address')?.value);
    formData.append('password', this.usersForm.get('password')?.value);

    if (this.logoFile) formData.append('image', this.logoFile);
   
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
