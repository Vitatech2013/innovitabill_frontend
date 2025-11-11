import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
  users: any[] = [];
  roles: any[] = [];
  usersForm!: FormGroup;
  title: string = '';
  selectedUserId: string | null = null;
  logoFile: File | null = null;
  business_id: string = '';
  openModel = false;

  constructor(
    private service: BusinessService,
    private api: BillingService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const bid = JSON.parse(storedUser);
      this.business_id = bid._id || '';
      console.log('Business ID:', this.business_id);
    }

    this.usersForm = this.fb.group({
      user_name: ['', Validators.required],
      user_email: ['', [Validators.required, Validators.email]],
      phone_number: ['', Validators.required],
      password: ['', Validators.required],
      role_id: ['', Validators.required],
    });

    this.getUsers();
    this.getRoles();
  }

  getRoles() {
    this.api.getRoles().subscribe({
      next: (res: any) => {
        this.roles = res.data || [];
        console.log('Roles:', this.roles);
      },
      error: (err) => console.error('Error loading roles:', err),
    });
  }

  getUsers() {
    this.service.getUsers().subscribe({
      next: (res: any) => {
        this.users = Array.isArray(res) ? res : res.data || [];
        console.log('Users list:', this.users);
      },
      error: (err) => console.error('Get users error:', err),
    });
  }
  openAddModal() {
    this.title = 'Add User';
    this.resetForm();
    this.openModel = true;
  }

  resetForm() {
    this.usersForm.reset();
    this.selectedUserId = null;
    this.logoFile = null;
  }

  edit(user: any) {
    this.selectedUserId = user._id;
    this.title = 'Edit User';
    this.usersForm.patchValue({
      user_name: user.user_name || user.full_name,
      user_email: user.user_email || user.email,
      phone_number: user.phone_number,
      image: user.image || user.image,
      id_proof: user.id_proof || user.id_proof,
      password: user.password || '',
      role_id: user.role_id?._id || user.role_id || '',
    });
  }



  createOrUpdateUser() {
    if (this.usersForm.invalid) {
      alert('Please fill all required fields correctly');
      return;
    }

    const formData = new FormData();
    formData.append('user_name', this.usersForm.get('user_name')?.value);
    formData.append('user_email', this.usersForm.get('user_email')?.value);
    formData.append('phone_number', this.usersForm.get('phone_number')?.value);
    formData.append('password', this.usersForm.get('password')?.value);
    formData.append('role_id', this.usersForm.get('role_id')?.value);
    formData.append('business_id', this.business_id);

    if (this.logoFile) {
      formData.append('image', this.logoFile);
      formData.append('id_proof', this.logoFile);
    }

    if (this.selectedUserId) {
      // Update
      this.service.updateUser(this.selectedUserId, formData).subscribe({
        next: () => {
          alert('User updated successfully');
          this.getUsers();
          this.resetForm();
        },
        error: (err) => console.error('Update error', err),
      });
    } else {
      // Create
      this.service.createUser(formData).subscribe({
        next: () => {
          alert('User added successfully');
          this.getUsers();
          this.resetForm();
        },
        error: (err) => console.error('Create error', err),
      });
    }
  }
    delete(id: string) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    this.service.deleteUser(id).subscribe({
      next: () => {
        alert('User deleted successfully');
        this.getUsers();
      },
      error: (err) => console.error('Delete error', err),
    });
  }
}
