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
  selectedUserId: string | null = null; // edit / update
  selectedUserData: any = null; // view modal
  toastMessage: any;
  toastType: any;
  searchTerm: string = '';
  users: any[] = [];
  u: any;
  deleteId: string | null = null;
  business_id: string | null = null;
  userForm!: FormGroup;
  roles: any;
  title = 'Add User';
  imageFile: File | null = null;
  idProofFile: File | null = null;
  imageBaseUrl = 'http://localhost:3009/business_images/';
  imageFileName: string = '';
idProofFileName: string = '';


  constructor(
    private fb: FormBuilder,
    private service: BusinessService,
    private router: Router
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
      user_name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-z]+( [A-Za-z]+)*$/),
]],
      user_email: ['', [Validators.required, Validators.email]],
      phone_number: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
      ],
      password: [''],
      role_id: ['', Validators.required],
      status: ['active'],

      house_No: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?!\s)(?!.*\(\s)(?!.*\s\))[a-zA-Z0-9!@#$%^&*(),.?":{}|<>_\-\/\\ ]+$/
          ),   Validators.pattern(/^(?!\s)(?!.*\s{2,}).+$/),
        ],
      ],
      town_Name: ['', Validators.required],
      mandal_Name: ['', Validators.required],
      district_Name: ['', Validators.required],
      state: ['', Validators.required],
      pincode: [
  '',
  [
    Validators.required,
    Validators.pattern(/^[0-9]{6}$/)
  ]
],
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

  allowLettersAndSingleSpace(event: KeyboardEvent) {
  const input = event.target as HTMLInputElement;
  const value = input.value;
  const key = event.key;


  if (key.length > 1) return;

  if (/^[A-Za-z]$/.test(key)) return;


  if (
    key === ' ' &&
    value.length > 0 &&
    value[value.length - 1] !== ' '
  ) {
    return;
  }

  event.preventDefault();
}
allowSingleSpace(event: KeyboardEvent) {
  const input = event.target as HTMLInputElement;
  const key = event.key;
  const value = input.value;

  // allow control keys (backspace, arrows, delete)
  if (key.length > 1) return;

  // ❌ block space at start
  if (key === ' ' && value.length === 0) {
    event.preventDefault();
    return;
  }

  // ❌ block multiple spaces
  if (key === ' ' && value[value.length - 1] === ' ') {
    event.preventDefault();
    return;
  }
}



  openAddModal() {
    this.title = 'Add User';
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

  // editUser(u: any) {
  //   this.selectedUserId = u._id; // ✅ USER ID

  //   this.userForm.patchValue({
  //     user_name: u.user_name,
  //     user_email: u.user_email,
  //     phone_number: u.phone_number,
  //     role_id: u.role_id?._id || '',
  //     status: u.status,
  //     house_No: u.address?.house_No,
  //     town_Name: u.address?.town_Name,
  //     mandal_Name: u.address?.mandal_Name,
  //     district_Name: u.address?.district_Name,
  //     state: u.address?.state,
  //     pincode: u.address?.pincode,
  //   });

  //   const modal = new bootstrap.Modal(document.getElementById('editModal'));
  //   modal.show();
  // }

  // createUser(): void {
  //   console.log('Create button clicked'); // 👈 MUST appear

  //   if (this.userForm.invalid) {
  //     console.log('Form invalid', this.userForm.value);
  //     this.userForm.markAllAsTouched();
  //     return;
  //   }

  //   const formData = new FormData();

  //   Object.keys(this.userForm.value).forEach((key) => {
  //     const value = this.userForm.value[key];
  //     if (value !== null && value !== undefined) {
  //       formData.append(key, String(value));
  //     }
  //   });

  //   formData.append('image', this.imageFile);
  //   formData.append('id_proof', this.idProofFile);

  //   console.log('FormData ready');

  //   this.service.addUser(formData).subscribe(
  //     (res: any) => {
  //       console.log('User created successfully', res);
  //       this.userForm.reset();
  //     },
  //     (err: any) => {
  //       console.error('Error creating user', err);
  //     }
  //   );
  // }


editUser(u: any) {
  this.selectedUserId = u._id;

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

  // ✅ FILE NAMES (important)
  this.imageFileName = u.image || '';
  this.idProofFileName = u.id_proof || '';

  const modal = new bootstrap.Modal(document.getElementById('editModal'));
  modal.show();
}



  createUser(): void {
    // 1️⃣ Validate form
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      console.log('✅ createUser() fired');

      return;
    }

    // 2️⃣ Validate files
    if (!this.imageFile || !this.idProofFile) {
      alert('Image and ID Proof are required');
      return;
    }

    const formData = new FormData();

    // 3️⃣ Append user fields
    formData.append('user_name', this.userForm.value.user_name);
    formData.append('user_email', this.userForm.value.user_email);
    formData.append('phone_number', this.userForm.value.phone_number);
    formData.append('password', this.userForm.value.password);
    formData.append('role_id', this.userForm.value.role_id);
    formData.append('status', this.userForm.value.status);

    // 4️⃣ Append business ID
    if (this.business_id) {
      formData.append('business_id', this.business_id);
    }

    // 5️⃣ Append address as JSON
    const address = {
      house_No: this.userForm.value.house_No,
      town_Name: this.userForm.value.town_Name,
      mandal_Name: this.userForm.value.mandal_Name,
      district_Name: this.userForm.value.district_Name,
      state: this.userForm.value.state,
      pincode: this.userForm.value.pincode,
    };
    formData.append('address', JSON.stringify(address));

    // 6️⃣ Append files
    formData.append('image', this.imageFile);
    formData.append('id_proof', this.idProofFile);

    // 🔍 Debug (compare with Postman)
    formData.forEach((value, key) => console.log(key, value));

    // 7️⃣ API Call
    this.service.addUser(formData).subscribe({
      next: (res: any) => {
        console.log('User created successfully', res);
        alert('User created successfully');

        this.userForm.reset();
        this.imageFile = null;
        this.idProofFile = null;

        this.loadUsers(); // refresh table
      },
      error: (err) => {
        console.error('Create User Error:', err);
        alert(err.error?.message || 'Failed to create user');
      },
    });
  }

  onImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
    }
  }

  onIdProofSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.idProofFile = input.files[0];
    }
  }

  saveUser(): void {
    if (!this.selectedUserId) {
      console.error('User ID missing');
      return;
    }

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      console.log('SAVE CLICKED');
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
        alert('User updated successfully');

        this.userForm.reset();
        this.selectedUserId = null;
        this.loadUsers();

        const modalEl = document.getElementById('editModal');
        bootstrap.Modal.getInstance(modalEl)?.hide();
      },
      error: (err) => {
        console.error('Update error', err);
        alert(err.error?.message || 'Update failed');
      },
    });
  }

  onFileSelect(event: any) {
    this.imageFile = event.target.files[0];
    console.log('Selected file:', this.imageFile);
  }

  openViewModal(u: any) {
    console.log('VIEW USER DATA 👉', u);
    this.selectedUserData = { ...u };

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
// getUsers() {
//   this.service.getUser().subscribe((res: any) => {
//     this.users = (res.data || [])
//       .map((u: any) => ({
//         ...u,
//         imageUrl: this.getImageUrl(u.image),
//         id_proofUrl: this.getImageUrl(u.id_proof),
//       }))
//       .sort(
//         (a: any, b: any) =>
//           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//       );

//     // optional: auto-select latest user
//     this.selectedUser = this.users.length ? this.users[0] : null;
//   });
// }



  confirmDelete() {
    if (!this.selectedUserId) return;
    this.service.deleteUser(this.selectedUserData._id).subscribe({
      next: () => {
        // this.showToast('Unit soft deleted successfully', 'success');
        // this.UnitForm.markAllAsTouched()

        this.loadUsers();

        const modalEl = document.getElementById('deleteModal');
        if (modalEl) {
          const modal = bootstrap.Modal.getInstance(modalEl);
          modal?.hide();
        }
        this.selectedUserData = null;
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
onlyDigits(event: KeyboardEvent, max: number) {
  const el = event.target as HTMLInputElement;
  if (event.key.length > 1) return;           // backspace, arrows
  if (!/\d/.test(event.key) || el.value.length >= max)
    event.preventDefault();
}



  blockSpaces(event: KeyboardEvent) {
    if (event.code === 'Space') event.preventDefault();
  }
}
