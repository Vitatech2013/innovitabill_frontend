import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BillingService } from '../billing.service';
import { constants } from '../../../constants';
declare var bootstrap: any;
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  profileForm!: FormGroup;

  selectedImage: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  addressFields = [
    { label: 'House No', name: 'house_No' },
    { label: 'Town Name', name: 'town_Name' },
    { label: 'Mandal Name', name: 'mandal_Name' },
    { label: 'District Name', name: 'district_Name' },
    { label: 'State', name: 'state' },
    { label: 'Pincode', name: 'pincode' },
  ];
  profile: any;
  user_id: any;
  userData: any;
  toastMessage: string | null = null;
  toastType: string | undefined;
  private baseUrl = constants.baseUrl;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: BillingService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const local = JSON.parse(localStorage.getItem('users') || '{}');
    this.user_id = local?.data?._id || local?._id;

    this.profileForm = this.fb.group({
      user_name: [''],
      phone_number: [''],
      user_email: [''],
      password: [''],
      address: this.fb.group({
        house_No: [''],
        town_Name: [''],
        mandal_Name: [''],
        district_Name: [''],
        state: [''],
        pincode: [''],
      }),
      image: [''],
    });

    this.fetchUserData();
  }

  profileedit() {
    if (!this.userData) return;

    this.previewUrl = this.getImageUrl(this.userData.image);

    this.profileForm.patchValue({
      user_name: this.userData.user_name,
      phone_number: this.userData.phone_number,
      user_email: this.userData.user_email,
      password: '',
      address: this.userData.address,
    });

    const modalEl = document.getElementById('editProfileModal');
    let modal = bootstrap.Modal.getInstance(modalEl);

    if (!modal) {
      modal = new bootstrap.Modal(modalEl);
    }

    modal.show();
  }

  getUserProfile() {
    if (this.profileForm.invalid) {
      this.showToast('Please fill all required feilds!', 'Danger');
      return;
    }

    const formData = new FormData();
    formData.append('user_name', this.profileForm.value.user_name);
    formData.append('phone_number', this.profileForm.value.phone_number);
    formData.append('user_email', this.profileForm.value.user_email);
    formData.append('password', this.profileForm.value.password);
    formData.append('address', JSON.stringify(this.profileForm.value.address));

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.service.updateprofile(formData, this.user_id).subscribe({
      next: (res: any) => {
        this.showToast('Profile Updated Successfully', 'success');
        this.fetchUserData();

        const modalEl = document.getElementById('editProfileModal');
        const modal = bootstrap.Modal.getInstance(modalEl);

        modal?.hide();

        modalEl?.addEventListener('hidden.bs.modal', () => {
          document
            .querySelectorAll('.modal-backdrop')
            .forEach((backdrop) => backdrop.remove());

          document.body.classList.remove('modal-open');
          document.body.style.overflow = 'auto';
          document.body.style.filter = 'none';
          document.body.style.removeProperty('pointer-events');
          document.body.style.paddingRight = '0';

          const container = document.querySelector('.container, .card');
          if (container) {
            container.classList.remove('profile-blur');
            if (container instanceof HTMLElement)
              container.style.filter = 'none';
          }
        });
        window.location.reload();
      },

      error: (err) => {
        console.error(err);
        this.showToast('Profile Update Failed!', 'Danger');
      },
    });
  }
  fetchUserData() {
    if (!this.user_id) return;

    this.service.getuserprofile(this.user_id).subscribe({
      next: (res: any) => {
        this.userData = res?.data || res;

        this.previewUrl = this.userData?.image
          ? `${this.baseUrl}/business_images/${this.userData.image}`
          : // `http://78.142.47.247:3009/business_images/${this.userData.image}`
            null;

        this.profileForm.patchValue({
          user_name: this.userData.user_name,
          phone_number: this.userData.phone_number,
          user_email: this.userData.user_email,
          password: this.userData.password,
          address: this.userData.address || {},
          image: this.userData.image,
        });
        console.log('User Data from backend:', this.userData);
        console.log('Image returned:', this.userData?.image);
      },
      error: (err) => console.error('Profile fetch error:', err),
    });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result);
      reader.readAsDataURL(file);
    }
  }
  getImageUrl(image: string): string {
    return image
      ? //  `http://78.142.47.247:3009/business_images/${image}`
        `${this.baseUrl}/business_images/${image}`
      : '';
  }

  showToast(message: string, type: string) {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => (this.toastMessage = null), 3000);
  }
}
