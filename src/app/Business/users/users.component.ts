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
  selectedFilter: string = 'Active';
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
      password: ['', Validators.required],
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
        this.users = (res.data || res).sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        console.log('Categories Loaded (Latest First):', this.users);
        this.users = res.data || [];
      },
      error: (err) => console.error('Error loading users:', err),
    });
  }

  openAddModal() {
    this.selectedUserId = null;
    this.userForm.reset({ status: 'active' });

   
    this.userForm.get('password')?.setValidators(Validators.required);
    this.userForm.get('image')?.setValidators(Validators.required);
    this.userForm.get('id_proof')?.setValidators(Validators.required);

    ['password', 'image', 'id_proof'].forEach((field) =>
      this.userForm.get(field)?.updateValueAndValidity(),
    );

    new bootstrap.Modal(document.getElementById('AddModal')).show();
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
        String(val).toLowerCase().includes(term),
      ),
    );
  }
  filteredByStatus(): any[] {
    if (this.statusFilter === 'all') {
      return this.filteredUser();
    }
    return this.filteredUser().filter(
      (u: any) => u?.status === this.statusFilter,
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

editUser(u: any) {

  this.selectedUser = u;
  this.selectedUserId = u._id;

  // ✅ Patch User Details
  this.userForm.patchValue({
    user_name: u.user_name,
    user_email: u.user_email,
    phone_number: u.phone_number,
    role_id: u.role_id?._id,
    status: u.status,
    house_No: u.address?.house_No,
    town_Name: u.address?.town_Name,
    mandal_Name: u.address?.mandal_Name,
    district_Name: u.address?.district_Name,
    state: u.address?.state,
    pincode: u.address?.pincode
  });

  // ✅ Fetch Bank Details
  this.service.getBanksByUser(this.selectedUserId).subscribe({

    next: (res: any) => {

      const allBanks = res.data || [];

      // 🔥 Filter only selected user bank
      const userBank = allBanks.find(
        (bank: any) => bank.user_id === this.selectedUserId
      );

      if (userBank) {

        this.userForm.patchValue({
          accountHolderName: userBank.accountHolderName,
          bankName: userBank.bankName,
          accountNumber: userBank.accountNumber,
          ifscCode: userBank.ifscCode,
          branchName: userBank.branchName,
          accountType: userBank.accountType
        });

      } else {

        // If no bank data
        this.userForm.patchValue({
          accountHolderName: '',
          bankName: '',
          accountNumber: '',
          ifscCode: '',
          branchName: '',
          accountType: ''
        });

      }

    },

    error: (err) => {
      console.log("Bank Fetch Error", err);
    }

  });

  // ✅ Remove validators for edit
  ['password','image','id_proof'].forEach(field => {
    this.userForm.get(field)?.clearValidators();
    this.userForm.get(field)?.updateValueAndValidity();
  });

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
    pincode: this.userForm.value.pincode
  };

  formData.append('address', JSON.stringify(address));

  formData.append('image', this.imageFile);
  formData.append('id_proof', this.idProofFile);

  this.service.addUser(formData).subscribe({

    next: (res: any) => {

      console.log('User created successfully', res);

      const newUser = res.data;

      // ✅ set user id
      this.selectedUserId = newUser._id;

      // ✅ bank payload
      const bankData = {
        business_id: this.business_id,
        user_id: this.selectedUserId,
        accountHolderName: this.userForm.value.accountHolderName,
        bankName: this.userForm.value.bankName,
        accountNumber: this.userForm.value.accountNumber,
        ifscCode: this.userForm.value.ifscCode,
        branchName: this.userForm.value.branchName,
        accountType: this.userForm.value.accountType
      };

      // ✅ save bank
      this.service.addBank(bankData).subscribe({
        next: () => {
          console.log('Bank saved successfully');
        },
        error: (err) => {
          console.log('Bank save error', err);
        }
      });

      this.showToast('User created successfully', 'success');

      this.userForm.reset();
      this.imageFile = null;
      this.idProofFile = null;

      this.loadUsers();

      const modalEl = document.getElementById('AddModal');
      if (modalEl) {
        const modalInstance =
          bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modalInstance.hide();
      }

    },

    error: (err) => {
      console.log('User create error', err);
      this.showToast('Failed to create user', 'error');
    }

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
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.showToast('Please fill details correctly', 'warning');
      return;
    }

    const formData = new FormData();

    Object.entries(this.userForm.value).forEach(([k, v]) => {
      if (v !== null && v !== '') {
        formData.append(k, v as string);
      }
    });

    // ✅ ONLY IF USER SELECTED NEW FILE
    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    if (this.idProofFile) {
      formData.append('id_proof', this.idProofFile);
    }

    this.service.updateUser(this.selectedUserId!, formData).subscribe({
      next: () => {
        console.log('User updated successfully');
        this.showToast('User updated successfully', 'success');
        this.loadUsers();
        bootstrap.Modal.getInstance(
          document.getElementById('editModal'),
        )?.hide();
      },
      error: () => this.showToast('Update failed', 'error'),
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

  openModal() {
    this.isEdit = false;
    this.bankForm = {};
  }
  openAccount(user: any) {
    this.selectedUserId = user._id;

    console.log('Opening bank modal for user:', this.selectedUserId);

    this.getBanks(); 

    const modal = new bootstrap.Modal(document.getElementById('bankModal'));

    modal.show();
  }
  openAddBank() {
    this.isEdit = false; // Add mode
    this.editId = null; // reset edit id

    this.bankForm = {
      accountHolderName: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      branchName: '',
    };

    this.showBankForm = true; // modal open
  }
getBanks() {
  if (!this.selectedUserId) {
    console.log('No user selected for bank fetch');
    return;
  }

  console.log('Fetching Banks for User:', this.selectedUserId);

  this.service.getBanksByUser(this.selectedUserId).subscribe({
    next: (res: any) => {

      const allBanks = res.data || [];

      this.bankList = allBanks.filter(
        (bank: any) => bank.user_id === this.selectedUserId
      );

      console.log("Filtered Bank List:", this.bankList);

      if (this.bankList.length > 0) {
        const bank = this.bankList[0];

        // ✅ patch to bankForm for edit
        this.bankForm = {
          accountHolderName: bank.accountHolderName,
          bankName: bank.bankName,
          accountNumber: bank.accountNumber,
          ifscCode: bank.ifscCode,
          branchName: bank.branchName,
          accountType: bank.accountType,
        };
      }
    },
    error: (err) => {
      console.log('Bank API Error', err);
      this.bankList = [];
    },
  });
}
  editBank(data: any) {
    this.isEdit = true;

    this.editId = data._id;

    this.bankForm = { ...data };
  }

  saveBank() {
    this.bankForm.business_id = this.business_id;
    this.bankForm.user_id = this.selectedUserId;

    console.log('Saving Bank Data:', this.bankForm); // ✅ Check data sending

    if (this.isEdit) {
      console.log('Edit Mode - Bank ID:', this.editId);

      this.service.updateBank(this.editId, this.bankForm).subscribe({
        next: (res: any) => {
          console.log('Bank Update API Response:', res); // ✅ API success

          this.showToast('Bank updated successfully', 'success');

          this.getBanks();

          this.bankForm = {};
          this.isEdit = false;
        },
        error: (err) => {
          console.log('Bank Update API Error:', err); // ❌ API error
        },
      });
    } else {
      console.log('Add Mode - Sending Data:', this.bankForm);

      this.service.addBank(this.bankForm).subscribe({
        next: (res: any) => {
          console.log('Bank Add API Response:', res); // ✅ API success

          this.showToast('Bank added successfully', 'success');
          
          this.getBanks();

          this.bankForm = {};
        },
        error: (err) => {
          console.log('Bank Add API Error:', err); // ❌ API error
        },
      });
    }
  }

  deleteBank(id: any) {
    this.service.deleteBank(id).subscribe(() => {
      this.showToast('Bank deleted', 'success');
      this.getBanks();
    });
  }
}
