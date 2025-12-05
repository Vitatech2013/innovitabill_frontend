import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BusinessService } from '../business.service';
import { BillingService } from '../billing.service';
declare var bootstrap: any;

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
  toastType: any;
  toastMessage: any;
  
  addressFields = [
    { name: 'house_No', label: 'House No' },
    { name: 'town_Name', label: 'Town Name' },
    { name: 'mandal_Name', label: 'Mandal' },
    { name: 'district_Name', label: 'District' },
    { name: 'state', label: 'State' },
    { name: 'pincode', label: 'Pincode' },
  ];

  selectedFiles: { [key: string]: File } = {};
  imageFile: File | null = null;
  idProofFile: File | null = null;
  previewUrl: string = 'assets/default-business.jpg';
  selectedImage: string | undefined;

  constructor(
    private service: BusinessService,
    private api: BillingService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== '{}') {
      const user = JSON.parse(storedUser);
      this.business_id =
        user._id || user.business_id || user.businessId || user.id || '';
    }

    this.usersForm = this.fb.group({
      user_name: ['', Validators.required],
      user_email: ['', [Validators.required, Validators.email]],
      phone_number: ['', Validators.required],
      password: ['', Validators.required],
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

    this.getUsers();
    this.getRoles();
  }

  // Fetch roles
  getRoles() {
    this.api.getRoles().subscribe({
      next: (res: any) => {
        this.roles = res.data || [];
      },
      error: (err) => console.error('Error loading roles:', err),
    });
  }

  // Fetch users
  getUsers() {
    this.service.getUser().subscribe((res: any) => {
      this.users = res.data || [];
    });
  }

  // Toast notification
  showToast(message: string, type: 'success' | 'error' | 'warning') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => (this.toastMessage = null), 3000);
  }

  // Open Add Modal
  openAddModal() {
    this.title = 'Add User';
    this.resetForm();
    const modal = new bootstrap.Modal(document.getElementById('userModal'));
modal.show();

  }

  // Reset form
  resetForm() {
    this.usersForm.reset();
    this.selectedUser = null;
    this.imageFile = null;
    this.idProofFile = null;
  }

  // Open View Modal
  openViewModal(user: any) {
    this.selectedUser = { ...user };
    this.selectedUser.imageUrl = this.getImageUrl(user.image);
    this.selectedUser.id_proofUrl = this.getImageUrl(user.id_proof);

    const modal = new bootstrap.Modal(document.getElementById('viewModal'));
    modal.show();
  }

  // Edit User
  edit(user: any) {
    this.selectedUser = { ...user };

    this.usersForm.patchValue({
      user_name: user.user_name || '',
      user_email: user.user_email || '',
      phone_number: user.phone_number || '',
      password: user.password || '',
      role_id: user.role_id?._id || '',
      status: user.status || '',
     image: user.image || '',
  id_proof: user.id_proof || '',
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

    this.selectedImage = user.image ? user.image.split('/').pop() : 'No File Chosen';
    const modal = new bootstrap.Modal(document.getElementById('userModal'));
modal.show();

  }

  // Create or Update user
  createOrUpdateUser() {
    if (this.usersForm.invalid) {
      this.usersForm.markAllAsTouched();
      this.showToast('Please fill all required fields correctly', 'warning');
      return;
    }

    const formData = new FormData();
    const values = this.usersForm.value;

    formData.append('user_name', values.user_name);
    formData.append('user_email', values.user_email);
    formData.append('phone_number', values.phone_number);
    formData.append('password', values.password);
    formData.append('role_id', values.role_id);
    formData.append('business_id', this.business_id);
    formData.append('_id', this.selectedUser?._id || '');


    const address = values.address;
    for (const key in address) {
      formData.append(`address[${key}]`, address[key]);
    }

    if (this.imageFile) formData.append('image', this.imageFile);
    if (this.idProofFile) formData.append('id_proof', this.idProofFile);

    if (this.selectedUser && this.selectedUser._id) {
      // Update
        console.log("Updating User ID:", this.selectedUser._id);
      this.service.updateUser(this.selectedUser._id, formData).subscribe({
        next: () => {
          this.showToast('User updated successfully', 'success');
          this.getUsers();
          this.resetForm();

 
          bootstrap.Modal.getInstance(document.getElementById('userModal'))?.hide();

        },
        error: (err) => {
          console.error('Update error', err);
          this.showToast('Failed to update User', 'error');
        },
      });
    } else {
      // Create
      this.service.createUser(formData).subscribe({
        next: () => {
          this.showToast('User added successfully', 'success');
          this.getUsers();
          this.resetForm();
          bootstrap.Modal.getInstance(document.getElementById('userModal'))?.hide();
        },
        error: (err) => {
          console.error('Create error', err);
          console.log("Create error", err.error);
          this.showToast('Failed to add User', 'error');
        },
      });
    }
  }

  // Handle file selection
onFileChange(event: any, fieldName: string) {
  const file = event.target.files[0];
  if (file) {
    this.selectedFiles[fieldName] = file;
    if (fieldName === 'image') {
      this.imageFile = file;
      this.previewUrl = URL.createObjectURL(file); // show selected file
    }
    if (fieldName === 'id_proof') {
      this.idProofFile = file;
    }
  }
}


  // Build image URL
  getImageUrl(path: string ): string {
    if (!path || path.trim() === '') return 'assets/images/default-business.jpg';
    const cleanPath = path.replace(/\\/g, '/');
    return cleanPath.includes('business_images/')
      ? `http://localhost:3009/${cleanPath}`
      : `http://localhost:3009/business_images/${cleanPath}`;
  }

  // Open image preview modal
  openImageModal(imagePath: string) {
    this.previewUrl = this.getImageUrl(imagePath || '');
    const modal = new bootstrap.Modal(document.getElementById('imagePreviewModal'));
    modal.show();
  }

  // Open delete confirmation
  openDeleteModal(user: any) {
    this.selectedUser = user;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
  }

  // Confirm delete
  confirmDelete() {
    if (!this.selectedUser) return;
    this.service.deleteUser(this.selectedUser._id).subscribe({
      next: () => {
        this.showToast('User soft deleted successfully', 'success');
        this.getUsers();
        bootstrap.Modal.getInstance(document.getElementById('deleteModal'))?.hide();
      },
      error: (err) => {
        console.error('Delete error', err);
        this.showToast('Failed to delete User', 'error');
      },
    });
  }

  // Log image loading errors
  logError(event: any) {
    console.log('Image failed loading:', event);
  }
}
