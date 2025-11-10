import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BillingService } from '../billing.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'], 
})
export class RolesComponent implements OnInit {
  selectedUserId: string | null = null;
  openModel = false;
  roleForm!: FormGroup;
  title = 'Add Role';
  business_id: any;
  roles: any[] = [];

  constructor(private api: BillingService, private fb: FormBuilder) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('Stored user:', user);
    this.business_id = user._id;
    console.log(this.business_id, 'business_id');

    this.roleForm = this.fb.group({
      role_name: ['', Validators.required],
      role_number: ['', Validators.required],
    });

    this.getAllRoles();
  }


  getAllRoles(): void {
    this.api.getRoles().subscribe({
      next: (res: any) => {
        this.roles = res.data;
        console.log('Roles loaded:', res.data);
      },
      error: (err) => console.error('Error loading roles:', err),
    });
  }

  
  openAddModal(): void {
    this.title = 'Add Role';
    this.resetForm();
    this.openModel = true;
  }

  
  closeModal(): void {
    this.openModel = false;
  }


  createOrUpdateRole(): void {
    if (this.roleForm.invalid) {
      alert('Please fill all required fields!');
      return;
    }

    const newRole = {
      ...this.roleForm.value,
      business_id: this.business_id,
    };

    this.api.addRole(newRole).subscribe({
      next: (res) => {
        console.log('Role saved:', res);
        alert('Role saved successfully!');
        this.roleForm.reset();
        this.getAllRoles();
        this.closeModal();
      },
      error: (err) => {
        console.error('Error saving:', err);
        if (err.status - 401) alert('Unauthorized! Please log in again.');
      },
    });
  }

  edit(role: any): void {
    this.selectedUserId = role._id;
    this.title = 'Edit Role';
    this.roleForm.patchValue({
      role_name: role.role_name,
      role_number: role.role_number,
    });
    this.openModel = true;
  }

  // ✅ Delete role
  delete(id: string): void {
    if (!confirm('Are you sure you want to delete this role?')) return;

    this.api.deleteRole(id).subscribe({
      next: () => {
        alert('Role deleted successfully');
        this.getAllRoles();
      },
      error: (err) => {
        console.error('Delete error:', err);
      },
    });
  }

  // ✅ Reset form
  resetForm(): void {
    this.roleForm.reset();
    this.selectedUserId = null;
  }
}

