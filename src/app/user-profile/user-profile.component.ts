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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: BillingService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const a = JSON.parse(localStorage.getItem('users') || '{}');
    this.user_id = a?.data?._id || a?._id || null;

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
    this.profileForm.patchValue({
      user_name: this.userData.user_name,
      phone_number: this.userData.phone_number,
      user_email: this.userData.user_email,
      password: this.userData.password,
      address: this.userData.address,
    });
  }

 getUserProfile() {
  if (this.profileForm.invalid) {
    alert('Please fill all required fields');
    return;
  }

  const formData = new FormData();
  formData.append('user_name', this.profileForm.get('user_name')?.value);
  formData.append('phone_number', this.profileForm.get('phone_number')?.value);
  formData.append('user_email', this.profileForm.get('user_email')?.value);
  formData.append('password', this.profileForm.get('password')?.value);

  
  formData.append('address', JSON.stringify(this.profileForm.get('address')?.value));

  if (this.selectedImage) {
    formData.append('image', this.selectedImage);
  }

  this.service.updateprofile(formData, this.user_id).subscribe({
    next: (res: any) => {
      alert('Profile updated successfully!');
      if (this.selectedImage) {
        const reader = new FileReader();
        reader.onload = () => {
          this.previewUrl = reader.result;
        };
        reader.readAsDataURL(this.selectedImage);
      }
      this.fetchUserData(); 
    },
    error: (err: any) => {
      console.error('Update failed:', err);
      alert('Profile update failed! Please try again.');
    },
  });
}

  fetchUserData() {
    if (!this.user_id) return;

    this.service.getuserprofile(this.user_id).subscribe({
      next: (res: any) => {
        console.log('✅ User profile fetched successfully:', res);
        this.userData = res?.data || res;

        this.previewUrl = this.userData?.image
          ? `http://localhost:3009/uploads/${this.userData.image}`
          : null;

        this.profileForm.patchValue(this.userData);
      },
      error: (err: any) =>
        console.error('❌ Error fetching admin profile:', err),
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
    if (image) {
      return `http://localhost:3009/${image}`;
    } else {
      return 'assets/default-profile.png';
    }
  }
}
