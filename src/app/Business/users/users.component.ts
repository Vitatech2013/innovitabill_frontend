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
import { Router } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  selectedUser: any;
  toastMessage: any;
  toastType: any;
  searchTerm: string = '';
  users: any[] = [];
  u: any;
  deleteId: string | null = null;
  business_id: any;
  userForm!: FormGroup;
  roles: any;
  title = 'Add User';

  constructor(private fb: FormBuilder, private service: BusinessService, private router:Router) {}
  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== '{}') {
      const user = JSON.parse(storedUser);
      this.business_id =
        user._id || user.business_id || user.businessId || user.id || '';
      console.log('businessID:', this.business_id);
    }
    this.userForm = this.fb.group({
      user_name: ['', [Validators.required, Validators.minLength(3)]],
      user_email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.minLength(10)]],
      password: [''],
      role_id: ['', Validators.required],
      // image: [''],
      // id_proof: [''],
      address: ['', [Validators.required, Validators.minLength(3)]],
      status: ['', [Validators.required]],
    });

    this.loadUsers();
    this.LoadRoles();
  }
  LoadRoles() {
    this.service.getRoles().subscribe({
      next: (res: any) => (this.roles = res.data || []),
      error: (err) => console.error('Error loading roles:', err),
    });
  }
  loadUsers() {
    this.service.getUser().subscribe({
      next: (res: any) => {
        console.log('Users data:', res.data);
        this.users = res.data || [];
      },
      error: (err) => console.error('Error loading users:', err),
    });
  }

  // filteredUser() {
  //   if (!this.searchTerm) return this.users;
  //   const term = this.searchTerm.toLowerCase();
  //   return this.users.filter((u: any) =>
  //     Object.values(u).some((val) =>
  //       val?.toString().toLowerCase().includes(term)
  //     )
  //   );
  // }

  openAddModal() {
    this.title = 'Add User';
    this.selectedUser = null;
    this.userForm.reset();
    (document.getElementById('AddModal') as any)?.classList.add('show');
  }
  closeModal() {
    (document.getElementById('AddModal') as any)?.classList.remove('show');
    this.userForm.reset();
    this.selectedUser = null;
  }
  filteredUser(): any[] {
    if (!Array.isArray(this.users)) return [];

    if (!this.searchTerm) return this.users;

    const term = this.searchTerm.toLowerCase();

    return this.users.filter((u: any) =>
      Object.values(u || {}).some((val) =>
        String(val).toLowerCase().includes(term)
      )
    );
  }

  editUser(u: any) {
    console.log('Edit data:', u);
    this.business_id = u._id;
    this.userForm.patchValue({
      user_name: u.user_name,
      user_email: u.user_email,
      // password: u.password,
      phone_number: u.phone_number,
      role_id: u.role_id?._id || '',
      address: JSON.stringify(u.address),
      status: u.status || u.user_status || u.status?.status || '',
    });
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
  }
  createUser() {
    // this.service.addUser()
  }
  saveUser() {
    throw new Error('Method not implemented.');
  }
  openViewModal(u: any) {
    this.selectedUser = { ...u };

    const modal = new bootstrap.Modal(document.getElementById('viewModal'));
    modal.show();
  }

  openDeleteModal(id: string) {
    this.deleteId = id;
    const modalEl = document.getElementById('deleteModal');
    if (modalEl) {
      let modal = bootstrap.Modal.getInstance(modalEl);
      if (!modal) modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  confirmDelete() {
    if (!this.selectedUser) return;
    this.service.deleteUser(this.selectedUser._id).subscribe({
      next: () => {
        // this.showToast('Unit soft deleted successfully', 'success');
        // this.UnitForm.markAllAsTouched()

        this.loadUsers();

        const modalEl = document.getElementById('deleteModal');
        if (modalEl) {
          const modal = bootstrap.Modal.getInstance(modalEl);
          modal?.hide();
        }
        this.selectedUser = null;
      },

      error: (err) => {
        console.error('Delete error', err);
        //  this.showToast('Failed to delete unit', 'error');
      },
    });
  }

  allowOnlyLetters(event: KeyboardEvent) {
    if (!/^[A-Za-z]$/.test(event.key)) event.preventDefault();
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    if (!/^[0-9]$/.test(event.key)) event.preventDefault();
  }

  blockSpaces(event: KeyboardEvent) {
    if (event.code === 'Space') event.preventDefault();
  }
}
