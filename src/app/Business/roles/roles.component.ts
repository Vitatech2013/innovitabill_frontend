import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BusinessService } from '../../Services/business.service';

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
  searchTerm: string = '';
  statusFilter: 'active' | 'inactive' = 'active';

  constructor(private api: BusinessService, private fb: FormBuilder) {}

  ngOnInit(): void {
    const b = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('Stored Business:', b);
    this.business_id = b._id;
    console.log('business_id:',this.business_id );

    this.roleForm = this.fb.group({
      role_name: ['', Validators.required],
      role_number: ['', Validators.required],
      status:['',Validators.required],
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

createOrUpdateRole(): void {
  if (this.roleForm.invalid) {
    this.roleForm.markAllAsTouched();
    this.showToast('Please fill all required fields!', 'warning');
    return;
  }

  const payload = {
    ...this.roleForm.value,
    business_id: this.business_id,
  };

  // **IF editing → call UPDATE API**
  if (this.selectedUserId) {
    this.api.updateRole(this.selectedUserId, payload).subscribe({
      next: (res) => {
        this.showToast('Role updated successfully!', 'success');
        this.roleForm.reset();
        this.selectedUserId = null;

        this.getAllRoles();

        const modal = bootstrap.Modal.getInstance(
          document.getElementById('roleModal')
        );
        modal.hide();
      },
      error: (err) => {
        console.error(err);
        this.showToast('Failed to update role!', 'error');
      },
    });
  } 
  else {
    // **IF adding → call ADD API**
    this.api.addRole(payload).subscribe({
      next: (res) => {
        this.showToast('Role added successfully!', 'success');
        this.roleForm.reset();

        this.getAllRoles();

        const modal = bootstrap.Modal.getInstance(
          document.getElementById('roleModal')
        );
        modal.hide();
      },
      error: (err) => {
        console.error(err);
        this.showToast('Failed to add role!', 'error');
      },
    });
  }
}


  edit(role: any): void {
    this.selectedUserId = role._id;
    this.title = 'Edit Role';
    this.roleForm.patchValue({
      role_name: role.role_name,
      role_number: role.role_number,
      status: role.status || role.status || role.status?.status || "",

    });
    this.openModel = true;
  }
    filteredUser() {
    if (!this.searchTerm) return this.roles;
    const term = this.searchTerm.toLowerCase();
    return this.roles.filter((u: any) =>
      Object.values(u).some((val) =>
        val?.toString().toLowerCase().includes(term)
      )
    );
  }
  filteredByStatus(): any[] {
  return this.filteredUser().filter(
    (u: any) => u?.status === this.statusFilter
  );
}

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
        
        const modal = bootstrap.Modal.getInstance(
            document.getElementById('deleteModal')
          );
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
allowOnlyLetters(event: KeyboardEvent) {
  const pattern = /^[A-Za-z]$/;
  if (!pattern.test(event.key)) {
    event.preventDefault(); // blocks numbers, spaces, special characters
  }
}
allowOnlyNumbers(event: KeyboardEvent) {
  const pattern = /^[0-9]$/;
  if (!pattern.test(event.key)) {
    event.preventDefault(); // blocks letters and special characters
  }
}
   blockSpaces(event: KeyboardEvent) {
    if (event.code === 'Space') event.preventDefault();
  }

}
