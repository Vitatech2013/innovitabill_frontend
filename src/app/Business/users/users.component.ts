import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BusinessService } from '../../Services/business.service';
import { constants } from '../../../../constants';
declare var bootstrap: any;

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  roles: any[] = [];
  usersForm!: FormGroup;
  title: string = '';
  selectedUser: any = null;
  business_id: string = '';
  toastType: 'success' | 'error' | 'warning' = 'success';
  toastMessage: string | null = null;
  private baseUrl = constants.baseUrl;
  searchTerm: string = '';
  addressFields = [
    { name: 'house_No', label: 'House No',placeholder:'Enter H.no' },
    { name: 'town_Name', label: 'Town Name', placeholder:'Enter Town Name' },
    { name: 'mandal_Name', label: 'Mandal' , placeholder:'Enter mandal Name'},
    { name: 'district_Name', label: 'District', placeholder:'Enter District Name' },
    { name: 'state', label: 'State' , placeholder:'Enter State'},
    { name: 'pincode', label: 'Pincode', placeholder:'Enter pincode' },
  ];

  imageFile: File | null = null;
  idProofFile: File | null = null;
  previewUrl: string = 'assets/business_images/logo.jpg';

  constructor(private fb: FormBuilder,private service:BusinessService) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== '{}') {
      const user = JSON.parse(storedUser);
      this.business_id = user._id || user.business_id || user.businessId || user.id || '';
    }

    this.initForm();
    this.getUsers();
    this.getRoles();
  }

  initForm() {
    this.usersForm = this.fb.group({
      user_name: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[A-Za-z]+$/)]],
      user_email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.minLength(10), Validators.pattern(/^[0-9]+$/)]],
      password:  [
    '',
    [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      ),
    ],
  ],
      role_id: ['', Validators.required],
      status: ['', Validators.required],
      image: '',
      id_proof: '',
      address: this.fb.group({
        house_No: [''],
        town_Name: [''],
        mandal_Name: [''],
        district_Name: [''],
        state: [''],
        pincode: [''],
      }),
    });
  }

  getRoles() {
    this.service.getRoles().subscribe({
      next: (res: any) => this.roles = res.data || [],
      error: (err) => console.error('Error loading roles:', err),
    });
  }
  

  getUsers() {
    this.service.getUser().subscribe((res: any) => {
      this.users = res.data.map((u: any) => ({
        ...u,
        imageUrl: this.getImageUrl(u.image),
        id_proofUrl: this.getImageUrl(u.id_proof),
      })) || [];
    });
  }

  showToast(message: string, type: 'success' | 'error' | 'warning') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => (this.toastMessage = null), 3000);
  }

 openAddModal() {
  this.title = 'Add User';
  this.resetForm();

  const modalEl = document.getElementById('userModal');
  if (modalEl) {
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl, {
      backdrop: true,  // still has backdrop
      keyboard: false
    });

    // Set lighter backdrop
    setTimeout(() => {
      const backdropEl = document.querySelector('.modal-backdrop') as HTMLElement;
      if (backdropEl) {
        backdropEl.style.backgroundColor = 'rgba(0,0,0,0.2)'; // lighter black
      }
    }, 10);

    modalInstance.show();
  }
}

  resetForm() {
    this.usersForm.reset();
    this.selectedUser = null;
    this.imageFile = null;
    this.idProofFile = null;
    this.previewUrl = 'assets/business_images/logo.jpg';
  }

  openViewModal(user: any) {
    this.selectedUser = { ...user };
    this.selectedUser.imageUrl = this.getImageUrl(user.image);
    this.selectedUser.id_proofUrl = this.getImageUrl(user.id_proof);
    new bootstrap.Modal(document.getElementById('viewModal')).show();
  }

  edit(user: any) {
    this.selectedUser = { ...user };
    this.usersForm.patchValue({
      user_name: user.user_name,
      user_email: user.user_email,
      phone_number: user.phone_number,
      password: user.password,
      role_id: user.role_id?._id || '',
      status: user.status,
      address: {
        house_No: user.address?.house_No || '',
        town_Name: user.address?.town_Name || '',
        mandal_Name: user.address?.mandal_Name || '',
        district_Name: user.address?.district_Name || '',
        state: user.address?.state || '',
        pincode: user.address?.pincode || '',
      },
    });
    this.selectedUser.imageUrl = this.getImageUrl(user.image);
    this.selectedUser.id_proofUrl = this.getImageUrl(user.id_proof);
    new bootstrap.Modal(document.getElementById('userModal')).show();
  }

  createOrUpdateUser() {
    if (this.usersForm.invalid) {
      this.usersForm.markAllAsTouched();
      this.showToast('Please fill all required fields correctly', 'warning');
      return;
    }

    const values = this.usersForm.value;
    const formData = new FormData();
    formData.append('user_name', values.user_name);
    formData.append('user_email', values.user_email);
    formData.append('phone_number', values.phone_number);
    formData.append('password', values.password || '');
    formData.append('role_id', values.role_id);
    formData.append('business_id', this.business_id);
    if (this.selectedUser?._id) formData.append('_id', this.selectedUser._id);

    // Append address
    for (const key in values.address) {
      formData.append(`address[${key}]`, values.address[key]);
    }

    // Append files
    if (this.imageFile) formData.append('image', this.imageFile);
    if (this.idProofFile) formData.append('id_proof', this.idProofFile);

    const apiCall = this.selectedUser && this.selectedUser._id
      ? this.service.updateUser(this.selectedUser._id, formData)
      : this.service.createUser(formData);

    apiCall.subscribe({
      next: (res: any) => {
        this.showToast(this.selectedUser?._id ? 'User updated successfully' : 'User added successfully', 'success');
        this.getUsers();
        this.resetForm();
        bootstrap.Modal.getInstance(document.getElementById('userModal'))?.hide();
      },
      error: (err) => {
        console.error(err);
        this.showToast(this.selectedUser?._id ? 'Failed to update User' : 'Failed to add User', 'error');
      },
    });
  }

  onFileChange(event: any, fieldName: 'image' | 'id_proof') {
    const file = event.target.files[0];
    if (!file) return;
    if (fieldName === 'image') this.imageFile = file;
    if (fieldName === 'id_proof') this.idProofFile = file;
    this.previewUrl = URL.createObjectURL(file);
  }

  getImageUrl(image: string | null): string {
    if (!image) return 'assets/business_images/logo.jpg';
    return `${this.baseUrl}/business_images/${image}`;
  }

  openImageModal(imagePath: string) {
    this.previewUrl = this.getImageUrl(imagePath || '');
    new bootstrap.Modal(document.getElementById('imagePreviewModal')).show();
  }

  openDeleteModal(user: any) {
    this.selectedUser = user;
    new bootstrap.Modal(document.getElementById('deleteModal')).show();
  }

  confirmDelete() {
    if (!this.selectedUser) return;
    this.service.deleteUser(this.selectedUser._id).subscribe({
      next: () => {
        this.showToast('User deleted successfully', 'success');
        this.getUsers();
        bootstrap.Modal.getInstance(document.getElementById('deleteModal'))?.hide();
      },
      error: (err) => {
        console.error(err);
        this.showToast('Failed to delete User', 'error');
      },
    });
  }

  logError(event: any) {
    event.target.src = 'assets/business_images/logo.jpg';
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
  filteredBusiness() {
    if (!this.searchTerm) return this.users;
    const term = this.searchTerm.toLowerCase();
    return this.users.filter((user) =>
      Object.values(user).some((val) =>
        val?.toString().toLowerCase().includes(term)
      )
    );
  }
}
