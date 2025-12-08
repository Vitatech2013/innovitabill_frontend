// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import {
//   FormBuilder,
//   FormGroup,
//   ReactiveFormsModule,
//   Validators,
// } from '@angular/forms';
// import { BusinessService } from '../business.service';
// import { BillingService } from '../billing.service';
// import { constants } from '../../../constants';
// declare var bootstrap: any;

// @Component({
//   selector: 'app-users',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './users.component.html',
//   styleUrls: ['./users.component.css'],
// })
// export class UsersComponent implements OnInit {
//   users: any[] = [];
//   roles: any[] = [];
//   usersForm!: FormGroup;
//   title: string = '';
//   selectedUser: any = null;
//   business_id: string = '';
//   toastType: any;
//   toastMessage: any;
//   private baseUrl = constants.baseUrl;

//   addressFields = [
//     { name: 'house_No', label: 'House No' },
//     { name: 'town_Name', label: 'Town Name' },
//     { name: 'mandal_Name', label: 'Mandal' },
//     { name: 'district_Name', label: 'District' },
//     { name: 'state', label: 'State' },
//     { name: 'pincode', label: 'Pincode' },
//   ];

//   selectedFiles: { [key: string]: File } = {};
//   imageFile: File | null = null;
//   idProofFile: File | null = null;
//   previewUrl: string = 'assets/default-business.jpg';
//   selectedImage: string | undefined;

//   constructor(
//     private service: BusinessService,

//     private fb: FormBuilder
//   ) {}

//   ngOnInit(): void {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser && storedUser !== '{}') {
//       const user = JSON.parse(storedUser);
//       this.business_id =
//         user._id || user.business_id || user.businessId || user.id || '';
//     }

//     this.usersForm = this.fb.group({
//       user_name: [
//         '',
//         [
//           Validators.required,
//           Validators.minLength(3),
//           Validators.pattern(/^[A-Za-z]+$/), // only letters, no numbers/spaces
//         ],
//       ],
//       user_email: ['', [Validators.required, Validators.email]],
//       phone_number: [
//         '',
//         [
//           Validators.required,
//           Validators.minLength(10),
//           Validators.pattern(/^[0-9]+$/), // only numbers
//         ],
//       ],

//       password: ['', Validators.required],
//       role_id: ['', Validators.required],
//       status: ['', Validators.required],
//       image: '',
//       id_proof: '',
//       address: this.fb.group({
//         house_No: [''],
//         town_Name: [''],
//         mandal_Name: [''],
//         district_Name: [''],
//         state: [''],
//         pincode: [''],
//       }),
//     });

//     this.getUsers();
//     this.getRoles();
//   }

//   // Fetch roles
//   getRoles() {
//     this.service.getRoles().subscribe({
//       next: (res: any) => {
//         this.roles = res.data || [];
//       },
//       error: (err: any) => console.error('Error loading roles:', err),
//     });
//   }

//   // Fetch users
//   getUsers() {
//     this.service.getUser().subscribe((res: any) => {
//       this.users = res.data || [];
//     });
//   }

//   // Toast notification
//   showToast(message: string, type: 'success' | 'error' | 'warning') {
//     this.toastMessage = message;
//     this.toastType = type;
//     setTimeout(() => (this.toastMessage = null), 3000);
//   }

//   // Open Add Modal
//   openAddModal() {
//     this.title = 'Add User';
//     this.resetForm();
//     const modal = new bootstrap.Modal(document.getElementById('userModal'));
//     modal.show();
//   }

//   // Reset form
//   resetForm() {
//     this.usersForm.reset();
//     this.selectedUser = null;
//     this.imageFile = null;
//     this.idProofFile = null;
//   }

//   // Open View Modal
//   openViewModal(user: any) {
//     this.selectedUser = { ...user };
//     this.selectedUser.imageUrl = this.getImageUrl(user.image);
//     this.selectedUser.id_proofUrl = this.getImageUrl(user.id_proof);

//     const modal = new bootstrap.Modal(document.getElementById('viewModal'));
//     modal.show();
//   }

//   // Edit User
//   edit(user: any) {
//     this.selectedUser = { ...user };

//     this.usersForm.patchValue({
//       user_name: user.user_name || '',
//       user_email: user.user_email || '',
//       phone_number: user.phone_number || '',
//       password: user.password || '',
//       role_id: user.role_id?._id || '',
//       status: user.status || '',
//       image: [''],       // add this
//   id_proof: ['']   ,
//       address: {
//         house_No: user.address?.house_No || '',
//         town_Name: user.address?.town_Name || '',
//         mandal_Name: user.address?.mandal_Name || '',
//         district_Name: user.address?.district_Name || '',
//         state: user.address?.state || '',
//         pincode: user.address?.pincode || '',
//       },
//     });

//     this.selectedUser.imageUrl = this.getImageUrl(user.image);
//     this.selectedUser.id_proofUrl = this.getImageUrl(user.id_proof);

//     this.selectedImage = user.image
//       ? user.image.split('/').pop()
//       : 'No File Chosen';
//     const modal = new bootstrap.Modal(document.getElementById('userModal'));
//     modal.show();
//   }

//   // Create or Update user
//   createOrUpdateUser() {
//   if (this.usersForm.invalid) {
//     this.usersForm.markAllAsTouched();
//     this.showToast('Please fill all required fields correctly', 'warning');
//     return;
//   }

//   const formData = new FormData();
//   const values = this.usersForm.value;

//   // Append basic user fields
//   formData.append('user_name', values.user_name);
//   formData.append('user_email', values.user_email);
//   formData.append('phone_number', values.phone_number);
//   formData.append('password', values.password || '');
//   formData.append('role_id', values.role_id);
//   formData.append('business_id', this.business_id);
//   formData.append('_id', this.selectedUser?._id || '');

//   // Append address
//   const address = values.address;
//   for (const key in address) {
//     formData.append(`address[${key}]`, address[key]);
//   }

//   // Append images if selected
//   if (this.imageFile) formData.append('image', this.imageFile);
//   if (this.idProofFile) formData.append('id_proof', this.idProofFile);

//   // Show instant preview in table before upload
//   if (this.selectedUser) {
//     if (this.imageFile) this.selectedUser.previewImage = URL.createObjectURL(this.imageFile);
//     if (this.idProofFile) this.selectedUser.previewIdProof = URL.createObjectURL(this.idProofFile);
//   }

//   // Call update or create API
//   const apiCall = this.selectedUser && this.selectedUser._id
//     ? this.service.updateUser(this.selectedUser._id, formData)
//     : this.service.createUser(formData);

//   apiCall.subscribe({
//     next: (res: any) => {
//       this.showToast(
//         this.selectedUser && this.selectedUser._id
//           ? 'User updated successfully'
//           : 'User added successfully',
//         'success'
//       );

//       // Update the user table with uploaded images
//       if (this.selectedUser && res.image) this.selectedUser.imageUrl = res.image;
//       if (this.selectedUser && res.id_proof) this.selectedUser.id_proofUrl = res.id_proof;

//       this.getUsers(); // refresh table
//       this.resetForm();
//       bootstrap.Modal.getInstance(document.getElementById('userModal'))?.hide();
//     },
//     error: (err) => {
//       console.error('Error', err);
//       this.showToast(
//         this.selectedUser && this.selectedUser._id
//           ? 'Failed to update User'
//           : 'Failed to add User',
//         'error'
//       );
//     },
//   });
// }

//   // Handle file selection
//   onFileChange(event: any, fieldName: string) {
//     const file = event.target.files[0];
//     if (file) {
//       this.selectedFiles[fieldName] = file;
//       if (fieldName === 'image') {
//         this.imageFile = file;
//         this.previewUrl = URL.createObjectURL(file); // show selected file
//       }
//       if (fieldName === 'id_proof') {
//         this.idProofFile = file;
//       }
//     }
//   }

//   // Build image URL
//   getImageUrl(image: string | null): string {
//     if (!image) return 'assets/business_images/logo.jpg';
//     return `${this.baseUrl}/business_images/${image}`;
//   }

//   // Open image preview modal
// openImageModal(imagePath: string) {
//   this.previewUrl = this.getImageUrl(imagePath || '');
//   const modalEl = document.getElementById('imagePreviewModal');
//   if (!modalEl) return; // safety check
//   const modal = new bootstrap.Modal(modalEl);
//   modal.show();
// }


//   // Open delete confirmation
//   openDeleteModal(user: any) {
//     this.selectedUser = user;
//     const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
//     modal.show();
//   }

//   // Confirm delete
//   confirmDelete() {
//     if (!this.selectedUser) return;
//     this.service.deleteUser(this.selectedUser._id).subscribe({
//       next: () => {
//         this.showToast('User soft deleted successfully', 'success');
//         this.getUsers();
//         bootstrap.Modal.getInstance(
//           document.getElementById('deleteModal')
//         )?.hide();
//       },
//       error: (err) => {
//         console.error('Delete error', err);
//         this.showToast('Failed to delete User', 'error');
//       },
//     });
//   }

//   // Log image loading errors
//   logError(event: any) {
//     console.error('Image failed loading:', event);
//     event.target.src = 'assets/business_images/logo.jpg'; // fallback image path
//   }

//   allowOnlyLetters(event: KeyboardEvent) {
//     const pattern = /^[A-Za-z]$/;
//     if (!pattern.test(event.key)) {
//       event.preventDefault(); // blocks numbers, spaces, special characters
//     }
//   }

//   allowOnlyNumbers(event: KeyboardEvent) {
//     const pattern = /^[0-9]$/;
//     if (!pattern.test(event.key)) {
//       event.preventDefault(); // blocks letters and special characters
//     }
//   }
//   // Prevent spaces anywhere
//   blockSpaces(event: KeyboardEvent) {
//     if (event.code === 'Space') {
//       event.preventDefault();
//     }
//   }
  
//   onImageSelect(event: any) {
//   const file = event.target.files[0];
//   if (!file) return;
//   this.imageFile = file;
// }

// onIdProofSelect(event: any) {
//   const file = event.target.files[0];
//   if (!file) return;
//   this.idProofFile = file;
// }


// }


import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BusinessService } from '../business.service';
import { constants } from '../../../constants';
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
  toastType: 'success' | 'error' | 'warning' = 'success';
  toastMessage: string | null = null;
  private baseUrl = constants.baseUrl;

  addressFields = [
    { name: 'house_No', label: 'House No' },
    { name: 'town_Name', label: 'Town Name' },
    { name: 'mandal_Name', label: 'Mandal' },
    { name: 'district_Name', label: 'District' },
    { name: 'state', label: 'State' },
    { name: 'pincode', label: 'Pincode' },
  ];

  imageFile: File | null = null;
  idProofFile: File | null = null;
  previewUrl: string = 'assets/business_images/logo.jpg';

  constructor(private service: BusinessService, private fb: FormBuilder) {}

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
    new bootstrap.Modal(document.getElementById('userModal')).show();
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
}
