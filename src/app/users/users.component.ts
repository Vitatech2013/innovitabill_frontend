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
  logoFile: File | null = null;
  business_id: string = '';
  openModel = false;
  toastType: any;
  toastMessage: any;
addressFields = [
    { name: "house_No", label: "House No" },
    { name: "town_Name", label: "Town Name" },
    { name: "mandal_Name", label: "Mandal" },
    { name: "district_Name", label: "District" },
    { name: "state", label: "State" },
    { name: "pincode", label: "Pincode" },
  ];
  selectedImage: string | undefined;



  constructor(
    private service: BusinessService,
    private api: BillingService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
   const storedUser = localStorage.getItem('user');
console.log("Stored user raw:", storedUser);

if (storedUser && storedUser !== "{}") {
  const user = JSON.parse(storedUser);

  this.business_id =
    user._id ||
    user.business_id ||
    user.businessId ||
    user.id ||
    "";

  console.log("Business ID:", this.business_id);
} else {
  console.error("User NOT FOUND OR EMPTY in localStorage");
}


    this.usersForm = this.fb.group({
      user_name: ['', Validators.required],
      user_email: ['', [Validators.required, Validators.email]],
      phone_number: ['', Validators.required],
      password: ['', Validators.required],
      role_id: ['', Validators.required],
      status: ['',Validators.required],
      address: this.fb.group({
        house_No: [''],
        town_Name: [''],
        mandal_Name: [''],
        district_Name: [''],
        state: [''],
        pincode: [''],
      })
    
    });

    this.getUsers();
    this.getRoles();
  }

  getRoles() {
    this.api.getRoles().subscribe({
      next: (res: any) => {
        this.roles = res.data || [];
        console.log('Roles:', this.roles);
      },
      error: (err) => console.error('Error loading roles:', err),
    });
  }

  getUsers() {
    this.service.getUsers().subscribe({
      next: (res: any) => {
        this.users = Array.isArray(res) ? res : res.data || [];
        console.log('Users list:', this.users);
      },
      error: (err) => {
        console.error('Get users error:', err);
        this.showToast('Failed to load units', 'error');
      },
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
    (document.getElementById('UserModal') as any)?.classList.add('show');
  }

  resetForm() {
    this.usersForm.reset();
    this.selectedUser = null;
    this.logoFile = null;
  }

getImageUrl(path: string | null | undefined): string {
  const BASE_URL = 'http://78.142.47.247:3009';

  if (!path || path.trim() === '') {
    return ''; // no default, return empty string
  }

  const cleanPath = path.replace(/\\/g, '/').trim();

  return cleanPath.includes('business_images/')
    ? `${BASE_URL}/${cleanPath}`
    : `${BASE_URL}/business_images/${cleanPath}`;
}


  getFileUrl(path: string): string {
    if (!path) return '#';
    const cleanPath = path.replace(/\\/g, '/');
    return cleanPath.includes('business_images/')
      ? `http://78.142.47.247:3009/${cleanPath}`
      : `http://78.142.47.247:3009/business_images/${cleanPath}`;
  }
  openImageModal(imageUrl: string) {
    this.selectedImage = imageUrl || 'assets/default-business.jpg';
    const modal = new bootstrap.Modal(
      document.getElementById('imagePreviewModal')
    );
    modal.show();
  }
openViewModal(b: any) {
    this.selectedUser = b;
    const modal = new bootstrap.Modal(document.getElementById('viewModal'));
    modal.show();
  }


  edit(user: any) {
    this.selectedUser = user._id;
    this.title = 'Edit User';
    this.usersForm.patchValue({
      user_name: user.user_name || user.full_name,
      user_email: user.user_email || user.email,
      phone_number: user.phone_number,
      image: user.image || user.image,
      id_proof: user.id_proof || user.id_proof,
      password: user.password || '',
      role_id: user.role_id?._id || user.role_id || '',
      status: user.status || user.business_status || user.status?.status || "",

      address: {
    house_No: user.address?.house_No || '',
    town_Name: user.address?.town_Name || '',
    mandal_Name: user.address?.mandal_Name || '',
    district_Name: user.address?.district_Name || '',
    state: user.address?.state || '',
    pincode: user.address?.pincode || '',
  }
      
    });
    (document.getElementById('UserModal') as any)?.classList.add('show');
  }

  createOrUpdateUser() {
    if (this.usersForm.invalid) {
      this.usersForm.markAllAsTouched();
      this.showToast('Please fill all required fields correctly', 'warning');
      return;
    }

  const formData = new FormData();
formData.append('user_name', this.usersForm.get('user_name')?.value);
formData.append('user_email', this.usersForm.get('user_email')?.value);
formData.append('phone_number', this.usersForm.get('phone_number')?.value);
formData.append('password', this.usersForm.get('password')?.value);
formData.append('role_id', this.usersForm.get('role_id')?.value);
formData.append('business_id', this.business_id);

// 🔥 Add address fields
const address = this.usersForm.get('address')?.value;

formData.append('address[house_No]', address.house_No);
formData.append('address[town_Name]', address.town_Name);
formData.append('address[mandal_Name]', address.mandal_Name);
formData.append('address[district_Name]', address.district_Name);
formData.append('address[state]', address.state);
formData.append('address[pincode]', address.pincode);

// Images (if uploaded)
if (this.logoFile) {
  formData.append('image', this.logoFile);
  formData.append('id_proof', this.logoFile);
}


    if (this.selectedUser) {
      // Update
      this.service.updateUser(this.selectedUser, formData).subscribe({
        next: () => {
          this.showToast('User updated successfully', 'success');
          this.getUsers();
          this.resetForm();
          const modal = bootstrap.Modal.getInstance(
            document.getElementById('userModal')
          );
          modal?.hide();
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
          const modal = bootstrap.Modal.getInstance(
            document.getElementById('userModal')
          );
          modal.hide();
        },
        error: (err) => {
          console.error('Create error', err);
          console.log("Create error", err.error);
          this.showToast('Failed to add User', 'error');
        },
      });
    }
  }
  //   delete(id: string) {
  //   if (!confirm('Are you sure you want to delete this user?')) return;
  //   this.service.deleteUser(id).subscribe({
  //     next: () => {
  //       alert('User deleted successfully');
  //       this.getUsers();
  //     },
  //     error: (err) => console.error('Delete error', err),
  //   });
  // }
  openDeleteModal(user: any) {
    this.selectedUser = user;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
  }
  confirmDelete() {
    if (!this.selectedUser) return;
    this.service.deleteUser(this.selectedUser._id).subscribe({
      next: () => {
        this.showToast('User soft deleted successfully', 'success');

        this.getUsers();
        const modal = bootstrap.Modal.getInstance(
          document.getElementById('deleteModal')
        );
        modal.hide();
      },
      error: (err) => {
        console.error('Delete error', err);
        this.showToast('Failed to delete unit', 'error');
      },
    });
  }
}
