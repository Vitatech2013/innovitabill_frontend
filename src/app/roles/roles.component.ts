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
declare var bootstrap: any;
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
toastMessage: any;
toastType: any;
  selectedRole: any;

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
      this.roleForm.markAllAsTouched();
      this.showToast('Please fill all required fields!','warning');
      return;
    }

    const newRole = {
      ...this.roleForm.value,
      business_id: this.business_id,
    };

    this.api.addRole(newRole).subscribe({
      next: (res) => {
        console.log('Role saved:', res);
        this.showToast('Role saved successfully!','success');
        this.roleForm.reset();
        this.getAllRoles();
        this.closeModal();
      },
      error: (err) => {
        console.error('Error saving:', err);
        if (err.status - 401) this.showToast('Unauthorized! Please log in again.','error');
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

  // delete(id: string): void {
  //   if (!confirm('Are you sure you want to delete this role?')) return;

  //   this.api.deleteRole(id).subscribe({
  //     next: () => {
  //       alert('Role deleted successfully');
  //       this.getAllRoles();
  //     },
  //     error: (err) => {
  //       console.error('Delete error:', err);
  //     },
  //   });
  // }

  resetForm(): void {
    this.roleForm.reset();
    this.selectedUserId = null;
  }
  openDeleteModal(roles: any) {
this.selectedRole = roles;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
  }
  confirmDelete() {
    if (!this.selectedRole) return;
    this.api.deleteRole(this.selectedRole._id).subscribe({
      next: () => {
                this.showToast('Role soft deleted successfully', 'success');

        this.getAllRoles();
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        modal.hide();
      },
      error: (err) =>{ 
        console.error('Delete error', err);
         this.showToast('Failed to delete unit', 'error');
      },
    });
  }
 showToast(message: string, type: 'success' | 'error' | 'warning') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => (this.toastMessage = null), 3000);
  }


}
