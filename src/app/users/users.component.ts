import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BusinessService } from '../business.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
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

  // Initialize reactive form
  initForm() {
    this.usersForm = this.fb.group({
      business_name: ['', Validators.required],
      owner_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // Get all users from backend
  getAllUsers() {
    this.service.getUsers().subscribe({
      next: (res: any) => {
        this.users = res;
      },
      error: (err:any) => {
        console.error('Error fetching users', err);
      },
    });
  }
edit(user: any) {
    this.selectedUserId = user._id;
    this.usersForm.patchValue({
      business_name: user.business_name,
      owner_name: user.owner_name,
      email: user.email,
    });

    // manually open modal (if not using data-bs-toggle)
    const modal = document.getElementById('postModal');
    if (modal) {
      const modalInstance = new (window as any).bootstrap.Modal(modal);
      modalInstance.show();
    }
  }

  // Create or Update user
  createuser() {
    if (this.usersForm.invalid) return;

    const userData = this.usersForm.value;

    if (this.selectedUserId) {
      // Update existing user
      this.service.updateUser(this.selectedUserId, userData).subscribe({
        next: (res:any) => {
          this.getAllUsers();
          this.resetForm();
        },
        error: (err:any) => {
          console.error(err);
        },
      });
    } else {
      // Create new user
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

  // Delete user
  delete(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.service.deleteUser(id).subscribe({
        next: (res:any) => {
          this.getAllUsers();
        },
        error: (err:any) => {
          console.error('Error deleting user', err);
        },
      });
    }
  }

  // Reset form after save/update
  resetForm() {
    this.usersForm.reset();
    this.selectedUserId = null;
  }
}