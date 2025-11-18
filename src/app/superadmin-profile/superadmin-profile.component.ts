// superadmin-profile.component.ts
import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BillingService } from '../billing.service';

@Component({
  selector: 'app-superadmin-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './superadmin-profile.component.html',
  styleUrls: ['./superadmin-profile.component.css'],
})
export class SuperadminProfileComponent implements OnInit {
  superadmin_id: any;
  profileForm!: FormGroup;
  superadminData: any;
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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private profileService: BillingService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const a = JSON.parse(localStorage.getItem('sa') || '{}');
    this.superadmin_id = a?.data?._id || a?._id || null;

    this.profileForm = this.fb.group({
      superadmin_name: [''],
      superadmin_number: [''],
      superadmin_mail: [''],
      superadmin_password: [''],
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

    // this.profileForm = this.fb.group({
    //   superadmin_name: ['', Validators.required],
    //   superadmin_number: ['', Validators.required],
    //   superadmin_mail: ['', [Validators.required, Validators.email]],
    //   superadmin_password: ['', Validators.required],
    //   address: this.fb.group({
    //     house_No: [''],
    //     town_Name: [''],
    //     mandal_Name: [''],
    //     district_Name: [''],
    //     state: [''],
    //     pincode: [''],
    //   }),
    //   image: [''],
    // });

    this.fetchAdminData();
  }

  // profileedit() {
  //   if (this.superadminData) this.profileForm.patchValue(this.superadminData);
  // }

 

 
  profileedit() {
    if (!this.superadminData) return;
    this.profileForm.patchValue({
      superadmin_name: this.superadminData.superadmin_name,
      superadmin_number: this.superadminData.superadmin_number,
      superadmin_mail: this.superadminData.superadmin_mail,
      superadmin_password: this.superadminData.superadmin_password,
      address: this.superadminData.address,
    });
  }

  updateadminprofile() {
    if (this.profileForm.invalid) {
      alert('Please fill all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('superadmin_name', this.profileForm.get('superadmin_name')?.value);
    formData.append('superadmin_number', this.profileForm.get('superadmin_number')?.value);
    formData.append('superadmin_mail', this.profileForm.get('superadmin_mail')?.value);
    formData.append('superadmin_password', this.profileForm.get('superadmin_password')?.value);
   formData.append(
  'address',
  JSON.stringify(this.profileForm.get('address')?.value)
);


    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.profileService.profileupdate(formData, this.superadmin_id).subscribe({
      next: (res: any) => {
        alert('Profile updated successfully!');
        if (this.selectedImage) {
          const reader = new FileReader();
          reader.onload = () => {
            this.previewUrl = reader.result;
          };
          reader.readAsDataURL(this.selectedImage);
        }
        this.fetchAdminData();
      },
      error: (err: any) => {
        console.error('Update failed:', err);
        alert('Profile update failed! Please try again.');
      },
    });
  }
   fetchAdminData() {
    if (!this.superadmin_id) return;

    this.profileService.getadminprofile(this.superadmin_id).subscribe({
      next: (res: any) => {
        console.log(' Admin profile fetched successfully:', res);
        this.superadminData = res?.data || res;

        this.previewUrl = this.superadminData?.image
          ? `http://localhost:3009/business_images/${this.superadminData.image}`
          : null;

        this.profileForm.patchValue(this.superadminData);
      },
      error: (err) => console.error(' Error fetching admin profile:', err),
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
  getImageUrl(image: string | ArrayBuffer | null): string {
  if (!image) {
    return '';
  }

  if (typeof image !== 'string') {
    return image.toString();
  }

  return `http://localhost:3009/business_images/${image}`;
}



}
