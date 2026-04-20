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
  selectedFilter: string = 'active';
  statusFilter: 'active' | 'inactive' | 'all' = 'active';
  users: any[] = [];
  showPassword = false;
  business_id: string | null = null;
  userForm!: FormGroup;
  roles: any;
  bankList: any[] = [];
  bankForm: any = {};
  isEdit = false;
  editId: any = null;
  selectedBank: any = {};
  imageFile: File | null = null;
  idProofFile: File | null = null;
  selectedUser: any = null;
  imageBaseUrl = 'http://localhost:3009/business_images/';
  showBankForm: boolean = false;

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
      user_name: ['', [Validators.required, Validators.minLength(3)]],
      user_email: ['', [Validators.required, Validators.email]],
      phone_number: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
      ],
password: [
  '',
  [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(12),
    Validators.pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/
    ),
  ],
],
      role_id: ['', Validators.required],
      status: ['active'],
      house_No: ['', Validators.required],
      town_Name: ['', Validators.required],
      mandal_Name: ['', Validators.required],
      district_Name: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      image: [null, Validators.required],
      id_proof: [null, Validators.required],
      accountHolderName: ['', Validators.required],
      bankName: ['', Validators.required],
      accountNumber: ['', Validators.required],
      ifscCode: ['', Validators.required],
      branchName: ['', Validators.required],
      accountType: ['', Validators.required],
    });

    this.getUsers();
    this.LoadRoles();
  }
  LoadRoles() {
    this.service.getRoles().subscribe({
      next: (res: any) => (this.roles = res.data || []),
      error: (err) => console.error('Error loading roles:', err),
    });
  }
  // loadUsers() {
  //   this.service.getUser().subscribe({
  //     next: (res: any) => {
  //       this.users = (res.data || res).sort(
  //         (a: any, b: any) =>
  //           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  //       );
  //       console.log('Categories Loaded (Latest First):', this.users);
  //       this.users = res.data || [];
  //     },
  //     error: (err) => console.error('Error loading users:', err),
  //   });
  // }
  // getUsers() {
  //   this.service.getUser().subscribe({
  //     next: (res: any) => {
  //        this.users = (res.data || []).map((u: any) => {
  //       u.status = (u.status || '').toLowerCase(); 
  //       return u;
  //     })
        
  //       .sort(
  //         (a: any, b: any) =>
  //           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  //       );
        
  //       console.log(this.users, 'uerlist');
  //     },
  //     error: (err) => {
  //       console.error(err);
  //     },
  //   });
  // }
getUsers() {
  this.service.getUser().subscribe({
    next: (res: any) => {
      this.users = (res.data || [])
        .map((u: any) => ({
          ...u,
          status: (u.status || '').toLowerCase(),
          createdAt: new Date(u.createdAt || 0)
        }))
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );

     
      const activeUsers = this.users.filter(
        (u: any) => u.status === 'active'
      );

      console.log(activeUsers, 'Active Users Only');
    },
    error: (err) => {
      console.error(err);
    },
  });
}
  trackById(index: number, item: any) {
    return item._id;
  }

  openAddModal() {
    this.selectedUserId = null;
    this.userForm.reset({ status: 'active' });

    this.userForm.get('password')?.setValidators([
  Validators.required,
  Validators.minLength(6),
  Validators.maxLength(12),
  Validators.pattern(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,12}$/
  )
]);
    this.userForm.get('image')?.setValidators(Validators.required);
    this.userForm.get('id_proof')?.setValidators(Validators.required);

    ['password', 'image', 'id_proof'].forEach((field) =>
      this.userForm.get(field)?.updateValueAndValidity(),
    );

    new bootstrap.Modal(document.getElementById('AddModal')).show();
  }
closeModal() {
  const addModalEl = document.getElementById('AddModal');
  const editModalEl = document.getElementById('editModal');

  const addModal = bootstrap.Modal.getInstance(addModalEl);
  const editModal = bootstrap.Modal.getInstance(editModalEl);

  addModal?.hide();
  editModal?.hide();

  document.body.classList.remove('modal-open');
  document.body.style.overflow = '';

  const backdrops = document.querySelectorAll('.modal-backdrop');
  backdrops.forEach(b => b.remove());

  this.userForm.reset();
  this.selectedUserId = null;
}

  filteredUser(): any[] {
    if (!Array.isArray(this.users)) return [];

    if (!this.searchTerm) return this.users;

    const term = this.searchTerm.toLowerCase();

    return this.users.filter((u: any) =>
      Object.values(u || {}).some((val) =>
        String(val).toLowerCase().includes(term),
      ),
    );
  }
  filteredByStatus(): any[] {
    if (this.statusFilter === 'all') {
      return this.filteredUser();
    }
    return this.filteredUser().filter(
      (u: any) => (u?.status || '').toLowerCase() === this.statusFilter,
    );
  }
  changeFilter(value: string) {
    this.selectedFilter = value;

    switch (value) {
      case 'All':
        this.showall();
        break;
      case 'Active':
        this.showActive();
        break;
      case 'Inactive':
        this.showInactive();
        break;
    }
  }
  showActive() {
    this.statusFilter = 'active';
  }

  showInactive() {
    this.statusFilter = 'inactive';
  }
  showall() {
    this.statusFilter = 'all';
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  editUser(user: any) {
    this.isEdit = true;
    this.selectedUserId = user._id;
    this.selectedUser = user;

    this.userForm.patchValue({
      user_name: user.user_name,
      user_email: user.user_email,
      phone_number: user.phone_number,
      role_id: user.role_id?._id,
      status: user.status,

      house_No: user.address?.house_No,
      town_Name: user.address?.town_Name,
      mandal_Name: user.address?.mandal_Name,
      district_Name: user.address?.district_Name,
      state: user.address?.state,
      pincode: user.address?.pincode,
    });

    this.userForm.get('password')?.clearValidators();
    this.userForm.get('image')?.clearValidators();
    this.userForm.get('id_proof')?.clearValidators();

    ['password', 'image', 'id_proof'].forEach((field) => {
      this.userForm.get(field)?.updateValueAndValidity();
    });

    if (user.bankDetails) {
      this.userForm.patchValue({
        accountHolderName: user.bankDetails.accountHolderName,
        bankName: user.bankDetails.bankName,
        accountNumber: user.bankDetails.accountNumber,
        ifscCode: user.bankDetails.ifscCode,
        branchName: user.bankDetails.branchName,
        accountType: user.bankDetails.accountType,
        
      });
    }

    this.openModal();
  }

  createUser() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();

    formData.append('user_name', this.userForm.value.user_name);
    formData.append('user_email', this.userForm.value.user_email);
    formData.append('phone_number', this.userForm.value.phone_number);
    formData.append('password', this.userForm.value.password);
    formData.append('role_id', this.userForm.value.role_id);
    formData.append('business_id', this.business_id || '');
    formData.append('status', this.userForm.value.status);

    formData.append(
      'address',
      JSON.stringify({
        house_No: this.userForm.value.house_No,
        town_Name: this.userForm.value.town_Name,
        mandal_Name: this.userForm.value.mandal_Name,
        district_Name: this.userForm.value.district_Name,
        state: this.userForm.value.state,
        pincode: this.userForm.value.pincode,
      }),
    );

    formData.append('accountHolderName', this.userForm.value.accountHolderName);
    formData.append('bankName', this.userForm.value.bankName);
    formData.append('accountNumber', this.userForm.value.accountNumber);
    formData.append('ifscCode', this.userForm.value.ifscCode);
    formData.append('branchName', this.userForm.value.branchName);
    formData.append(
      'accountType',
      this.userForm.value.accountType || 'Savings',
    );

    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    if (this.idProofFile) {
      formData.append('id_proof', this.idProofFile);
    }

this.service.addUser(formData).subscribe({
next: (res: any) => {
  const newUser = res.data;

  const selectedRole = this.roles.find(
    (r: any) => r._id === newUser.role_id
  );

  this.users.unshift({
    ...newUser,
    role_id: selectedRole, 
    status: (newUser.status || '').toLowerCase(),
    createdAt: new Date()
  });

  this.closeModal();
  this.userForm.reset();
},
  error: (err) => {
    console.error(err);
    this.showToast('Error creating user', 'error');
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

  saveUser() {
    if (this.userForm.invalid) return;

    const formData = new FormData();

    formData.append('user_name', this.userForm.value.user_name);
    formData.append('user_email', this.userForm.value.user_email);
    formData.append('phone_number', this.userForm.value.phone_number);
    formData.append('role_id', this.userForm.value.role_id);
    formData.append('status', this.userForm.value.status);

    formData.append(
      'address',
      JSON.stringify({
        house_No: this.userForm.value.house_No,
        town_Name: this.userForm.value.town_Name,
        mandal_Name: this.userForm.value.mandal_Name,
        district_Name: this.userForm.value.district_Name,
        state: this.userForm.value.state,
        pincode: this.userForm.value.pincode,
      }),
    );

    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    if (this.idProofFile) {
      formData.append('id_proof', this.idProofFile);
    }

    if (this.isEdit && this.selectedUserId) {
      this.service.updateUser(this.selectedUserId, formData).subscribe(() => {
        console.log('UPDATED');
        this.getUsers();
        this.closeModal();
      });
    } else {
      this.service.addUser(formData).subscribe(() => {
        console.log(' ADDED');
        this.getUsers();
        this.closeModal();
      });
    }
  }

  // saveUser() { this.bankForm.business_id = this.business_id;
  //    this.bankForm.user_id = this.selectedUserId;
  //    console.log('Saving Bank Data:', this.bankForm);
  //   if (this.isEdit) {
  //      console.log('Edit Mode - Bank ID:', this.editId);
  //      this.service.updateUser(this.editId, this.bankForm).subscribe({ next: (res: any) =>
  //       { console.log('Bank Update API Response:', res);
  //         this.showToast('Bank updated successfully', 'success');
  //          this.getUsers();
  //          this.bankForm = {};
  //           this.isEdit = false; }, error: (err) => { console.log('Bank Update API Error:', err);

  //               },
  //              });
  //              }
  //              else { console.log('Add Mode - Sending Data:', this.bankForm);
  //               this.service.addUser(this.bankForm).subscribe({ next: (res: any) => {
  //                  console.log('Bank Add API Response:', res);
  //                   this.showToast('Bank added successfully', 'success');
  //                   this.getUsers();
  //                    this.bankForm = {};
  //                 },
  //                 error: (err) => { console.log('Bank Add API Error:', err);

  //                  },
  //                  });
  //                  }
  //                  }

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
        this.users = this.users.map((user) => {
          if (user._id === this.selectedUserData._id) {
            return { ...user, status: 'inactive' };
          }
          return user;
        });

        this.showToast('User deactivated successfully', 'success');

        const modalEl = document.getElementById('deleteModal');
        if (modalEl) {
          const modal = bootstrap.Modal.getInstance(modalEl);
          modal?.hide();
        }

        this.selectedUserData = null;
      },
      error: (err) => {
        console.error('Deactivate error', err);
        this.showToast('Failed to deactivate user', 'error');
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

  openModal() {
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
  }
  openAccount(user: any) {
    this.selectedUserId = user._id;
    console.log('Selected User Changed:', this.selectedUserId);

    this.getBanks(this.selectedUserId!);

    const modal = new bootstrap.Modal(document.getElementById('bankModal'));

    modal.show();
  }
  openAddBank() {
    this.isEdit = false;
    this.editId = null;

    this.bankForm = {
      accountHolderName: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      branchName: '',
    };

    this.showBankForm = true;
  }
  getBanks(userId: string) {
    console.log('Fetching Banks for User:', userId);

    this.service.getBanksByUser(userId).subscribe({
      next: (res: any) => {
        console.log('API BANK RESPONSE:', res);

        this.bankList = res.data || [];

        console.log('FINAL BANK LIST:', this.bankList);
      },
      error: (err) => {
        console.error('Error fetching banks:', err);
      },
    });
  }
  editBank(data: any) {
    this.isEdit = true;
    this.editId = data._id;

    this.bankForm = {
      accountHolderName: data.accountHolderName,
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      ifscCode: data.ifscCode,
      branchName: data.branchName,
      accountType: data.accountType,
    };

    const modal = new bootstrap.Modal(document.getElementById('editBankModal'));
    modal.show();
  }

  saveBank() {
    console.log('Saving for User:', this.selectedUserId);
    this.bankForm.business_id = this.business_id;
    this.bankForm.user_id = this.selectedUserId;

    console.log('Saving Bank Data:', this.bankForm);

    if (this.isEdit) {
      console.log('Edit Mode - Bank ID:', this.editId);

      this.service.updateBank(this.editId, this.bankForm).subscribe({
        next: (res: any) => {
          console.log('Bank Update API Response:', res);

          this.showToast('Bank updated successfully', 'success');

          this.getBanks(this.selectedUserId!);

          this.bankForm = {};
          this.isEdit = false;
          const modalEl = document.getElementById('editBankModal');
          const modal = bootstrap.Modal.getInstance(modalEl);
          modal?.hide();
        },
        error: (err) => {
          console.log('Bank Update API Error:', err);
        },
      });
    } else {
      console.log('Add Mode - Sending Data:', this.bankForm);

      this.service.addBank(this.bankForm).subscribe({
        next: (res: any) => {
          console.log('Bank Add API Response:', res);

          this.showToast('Bank added successfully', 'success');

          this.getBanks(this.selectedUserId!);

          this.bankForm = {};
        },
        error: (err) => {
          console.log('Bank Add API Error:', err);
        },
      });
    }
  }

  

  deleteBank(bank: any) {
    this.service.updateBank(bank._id, { status: 'inactive' }).subscribe(() => {
      this.showToast('Bank deactivated', 'success');

      bank.status = 'inactive';

      this.getBanks(this.selectedUserId!);
    });
  }
  // updateStatus(user: any) {
  //   const newStatus = user.status === 'active' ? 'inactive' : 'active';

  //   this.service.updateUser(user._id, { status: newStatus }).subscribe({
  //     next: () => {
  //       user.status = newStatus;

  //       this.showToast('Status updated', 'success');

  //       this.getUsers();
  //     },
  //   });
  // }
  updateStatus(user: any) {
     console.log("BUTTON CLICKED", user); 
  const newStatus = user.status === 'active' ? 'inactive' : 'active';

  const formData = new FormData();
  formData.append('status', newStatus);

  this.service.updateUser(user._id, formData).subscribe({
    next: () => {
      user.status = newStatus; // UI update

      this.showToast('Status updated', 'success');

      this.getUsers(); // refresh list
    },
    error: (err) => {
      console.error(err);
      this.showToast('Failed to update status', 'error');
    }
  });
}
}
