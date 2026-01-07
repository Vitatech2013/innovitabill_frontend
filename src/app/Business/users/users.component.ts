import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router } from '@angular/router';
import { BusinessService } from '../../Services/business.service';

declare var bootstrap: any;

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  selectedUserId: string | null = null;
  selectedUserData: any = null;
  toastMessage: string | null = null;
  toastType: 'success' | 'error' | 'warning' = 'success';
  searchTerm: string = '';
  statusFilter: 'active' | 'inactive' | 'all' = 'all';
  users: any[] = [];

  
  business_id: string | null = null;
  userForm!: FormGroup;
  roles: any;
  title = 'Add User';
  imageFile: File | null = null;
  idProofFile: File | null = null;
  selectedUser: any = null;
  imageBaseUrl = 'http://localhost:3009/business_images/';

  constructor(
    private fb: FormBuilder,
    private service: BusinessService,
    
  ) {}
  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== '{}') {
      const user = JSON.parse(storedUser);
      this.business_id =
        user._id || user.business_id || user.businessId || user.id || '';
      console.log('businessID:', this.business_id);
    }
    this.userForm = this.fb.group({
      user_name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[A-Za-z]+( [A-Za-z]+)*$/),
        ],
      ],
      user_email: ['', [Validators.required, Validators.email]],
      phone_number: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(8),
          Validators.pattern(/^[A-Za-z0-9]{4,8}$/),
        ],
      ],
      role_id: ['', Validators.required],
      status: ['active'],

      house_No: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?!\s)(?!.*\(\s)(?!.*\s\))[a-zA-Z0-9!@#$%^&*(),.?":{}|<>_\-\/\\ ]+$/
          ),
        ],
      ],
      town_Name: ['', Validators.required],
      mandal_Name: ['', Validators.required],
      district_Name: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      image: [null, Validators.required],
      id_proof: [null, Validators.required],
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

  openAddModal() {
    this.title = 'Add User';
    this.selectedUser = null;
    this.selectedUserId = null;
    this.userForm.reset();
    this.imageFile = null;
    this.idProofFile = null;

    const modalEl = document.getElementById('AddModal');
    if (!modalEl) return;

    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }

  closeModal() {
    (document.getElementById('AddModal') as any)?.classList.remove('show');
    this.userForm.reset();
    this.selectedUserId = null;
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
  filteredByStatus(): any[] {
    if (this.statusFilter === 'all') {
      return this.filteredUser();
    }
    return this.filteredUser().filter(
      (u: any) => u?.status === this.statusFilter
    );
  }

  editUser(u: any) {
    this.selectedUserId = u._id;
    this.selectedUser = u;

    this.userForm.patchValue({
      user_name: u.user_name,
      user_email: u.user_email,
      phone_number: u.phone_number,
      role_id: u.role_id?._id || '',
      status: u.status,
      house_No: u.address?.house_No,
      town_Name: u.address?.town_Name,
      mandal_Name: u.address?.mandal_Name,
      district_Name: u.address?.district_Name,
      state: u.address?.state,
      pincode: u.address?.pincode,
    });

    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.userForm.get('image')?.clearValidators();
    this.userForm.get('image')?.updateValueAndValidity();

    this.userForm.get('id_proof')?.clearValidators();
    this.userForm.get('id_proof')?.updateValueAndValidity();

    this.imageFile = null;
    this.idProofFile = null;

    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
  }

  createUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.showToast('Please fill form fields correctly', 'warning');
      return;
    }

    if (!this.imageFile || !this.idProofFile) {
      this.showToast('Image and ID Proof are required', 'warning');
      return;
    }
    if (!this.imageFile || !this.idProofFile) {
      alert('Image and ID Proof are required');
      return;
    }

    const formData = new FormData();
    formData.append('user_name', this.userForm.value.user_name);
    formData.append('user_email', this.userForm.value.user_email);
    formData.append('phone_number', this.userForm.value.phone_number);
    formData.append('password', this.userForm.value.password);
    formData.append('role_id', this.userForm.value.role_id);
    formData.append('status', this.userForm.value.status);

    if (this.business_id) {
      formData.append('business_id', this.business_id);
    }

    const address = {
      house_No: this.userForm.value.house_No,
      town_Name: this.userForm.value.town_Name,
      mandal_Name: this.userForm.value.mandal_Name,
      district_Name: this.userForm.value.district_Name,
      state: this.userForm.value.state,
      pincode: this.userForm.value.pincode,
    };
    formData.append('address', JSON.stringify(address));

    formData.append('image', this.imageFile);
    formData.append('id_proof', this.idProofFile);

    formData.forEach((value, key) => console.log(key, value));

    this.service.addUser(formData).subscribe({
      next: (res: any) => {
        console.log('User created successfully', res);
        this.showToast('User created successfully', 'success');

        this.userForm.reset();
        this.imageFile = null;
        this.idProofFile = null;

        this.loadUsers();
        const modalEl = document.getElementById('AddModal');
        if (modalEl) {
          const modalInstance =
            bootstrap.Modal.getInstance(modalEl) ||
            new bootstrap.Modal(modalEl);
          modalInstance.hide();
        }
      },
      error: (err) => {
        console.error('Create User Error:', err);
        this.showToast('failed to create', 'error');
      },
    });
  }

  onImageSelect(event: any) {
    this.imageFile = event.target.files[0];
    this.userForm.patchValue({ image: this.imageFile });
  }

  onIdProofSelect(event: any) {
    this.idProofFile = event.target.files[0];
    this.userForm.patchValue({ id_proof: this.idProofFile });
  }

  saveUser(): void {
    if (!this.selectedUserId) {
      console.error('User ID missing');
      return;
    }

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.showToast('Please fill form fields correctly', 'warning');
      return;
    }

    const formData = new FormData();

    formData.append('user_name', this.userForm.value.user_name);
    formData.append('user_email', this.userForm.value.user_email);
    formData.append('phone_number', this.userForm.value.phone_number);
    formData.append('role_id', this.userForm.value.role_id);
    formData.append('status', this.userForm.value.status);

    const address = {
      house_No: this.userForm.value.house_No,
      town_Name: this.userForm.value.town_Name,
      mandal_Name: this.userForm.value.mandal_Name,
      district_Name: this.userForm.value.district_Name,
      state: this.userForm.value.state,
      pincode: this.userForm.value.pincode,
    };

    formData.append('address', JSON.stringify(address));

    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    if (this.idProofFile) {
      formData.append('id_proof', this.idProofFile);
    }

    this.service.updateUser(this.selectedUserId, formData).subscribe({
      next: (res) => {
        console.log('User updated successfully', res);

        this.showToast('User updated successfully', 'success');

        this.userForm.reset();
        this.selectedUserId = null;
        this.loadUsers();

        const modalEl = document.getElementById('editModal');
        bootstrap.Modal.getInstance(modalEl)?.hide();
      },
      error: (err) => {
        console.error('Update error', err);
        alert(err.error?.message || 'Update failed');
        this.showToast('Update failed', 'error');
      },
    });
  }



  openViewModal(u: any) {
    console.log('VIEW USER DATA', u);
    this.selectedUserData = { ...u };

    const modal = new bootstrap.Modal(document.getElementById('viewModal'));
    modal.show();
  }

  openDeleteModal(user: any) {
    this.selectedUserData = user;

    const modalEl = document.getElementById('deleteModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  confirmDelete() {
    if (!this.selectedUserData?._id) return;

    this.service.deleteUser(this.selectedUserData._id).subscribe({
      next: () => {
        this.loadUsers();
        console.log('User deleted successfully');

        this.showToast('User deleted successfully', 'success');

        const modalEl = document.getElementById('deleteModal');
        if (modalEl) {
          const modal = bootstrap.Modal.getInstance(modalEl);
          modal?.hide();
        }

        this.selectedUserData = null;
      },
      error: (err) => {
        console.error('Delete error', err);
        this.showToast('Failed to delete', 'error');
      },
    });
  }

  allowOnlyLetters(event: KeyboardEvent) {
    if (!/^[A-Za-z]$/.test(event.key)) event.preventDefault();
  }
  onlyDigits(event: KeyboardEvent, max: number) {
    const el = event.target as HTMLInputElement;
    if (event.key.length > 1) return;
    if (!/\d/.test(event.key) || el.value.length >= max) event.preventDefault();
  }
   removeFirstSpace() {
    const c = this.userForm.get('user_name');
    if (c?.value?.startsWith(' ')) {
      c.setValue(c.value.trimStart(), { emitEvent: false });
    }
  }
  removeExtraSpaces() {
  const control = this.userForm.get('user_name');
  if (control) {
    let value = control.value || '';

    value = value.replace(/^\s+/, '');

    
    value = value.replace(/\s{2,}/g, ' ');

    control.setValue(value, { emitEvent: false });
  }
}
 allowOnlyLettersAndSingleSpace(event: KeyboardEvent) {
  const inputChar = event.key;
  const currentValue = (event.target as HTMLInputElement).value;

  if (/^[a-zA-Z]$/.test(inputChar)) {
    return;
  }

  if (
    inputChar === ' ' &&
    currentValue.length > 0 &&
    !currentValue.endsWith(' ')
  ) {
    return;
  }

  event.preventDefault();
}
blockSpace(event: KeyboardEvent) {
  if (event.key === ' ') {
    event.preventDefault();
  }
}


  showToast(message: string, type: 'success' | 'error' | 'warning') {
    if (this.toastMessage) return;
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => (this.toastMessage = null), 3000);
  }
}
