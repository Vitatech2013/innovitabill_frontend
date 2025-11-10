import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BillingService } from '../billing.service';

@Component({
  selector: 'app-superadmin-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './superadmin-profile.component.html',
  styleUrls: ['./superadmin-profile.component.css']
})
export class SuperadminProfileComponent implements OnInit {

  superadmin_id: any;
  superadminprofileForm!: FormGroup;
  editForm!: FormGroup;
  superadminData: any;
  selectedImage: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private profileService: BillingService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const sa = JSON.parse(localStorage.getItem('sa') || '{}');
    this.superadmin_id = sa?.data?._id || sa?._id || null;
    console.log('Superadmin ID:', this.superadmin_id);

    this.superadminprofileForm = this.fb.group({
      superadmin_name: ['', Validators.required],
      superadmin_number: ['', Validators.required],
      superadmin_mail: ['', [Validators.required, Validators.email]],
      superadmin_password: ['', Validators.required],
      address: [''],
      image: ['']
    });

    this.editForm = this.fb.group({
      superadmin_name: ['', Validators.required],
      superadmin_number: ['', Validators.required],
      superadmin_mail: ['', [Validators.required, Validators.email]],
      superadmin_password: ['', Validators.required],
      address: [''],
      image: ['']
    });

    this.fetchAdminData();
  }

  /** ✅ Fetch Profile from Backend */
  fetchAdminData() {
    if (!this.superadmin_id) {
      console.error('Superadmin ID missing!');
      return;
    }

    this.profileService.getadminprofile(this.superadmin_id).subscribe(
      (res: any) => {
        console.log('Profile Response:', res);

        // Handle both object or array structure
        this.superadminData = res?.data
          ? (Array.isArray(res.data) ? res.data[0] : res.data)
          : res;

        console.log('Superadmin Data:', this.superadminData);

        if (this.superadminData) {
          this.superadminprofileForm.patchValue(this.superadminData);
          this.editForm.patchValue(this.superadminData);

          // Load backend image preview
          if (this.superadminData.image) {
            this.previewUrl = `http://localhost:3003/uploads/${this.superadminData.image}`;
          }
        }
      },
      (err: any) => {
        console.error('❌ Error fetching admin profile:', err);
        alert('Failed to load admin profile. Please try again later.');
      }
    );
  }

  /** ✅ Open modal with current data */
  profileedit() {
    if (!this.superadminData) return;
    this.editForm.patchValue(this.superadminData);

    // Show backend image inside modal too
    this.previewUrl = this.superadminData.image
      ? `http://localhost:3003/uploads/${this.superadminData.image}`
      : null;
  }

  /** ✅ Handle Image Change */
  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  /** ✅ Update Profile */
  updateadminprofile() {
    if (this.editForm.invalid) {
      alert('Please fill all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('superadmin_name', this.editForm.get('superadmin_name')?.value);
    formData.append('superadmin_number', this.editForm.get('superadmin_number')?.value);
    formData.append('superadmin_mail', this.editForm.get('superadmin_mail')?.value);
    formData.append('superadmin_password', this.editForm.get('superadmin_password')?.value);
    formData.append('address', this.editForm.get('address')?.value);

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.profileService.profileupdate(formData, this.superadmin_id).subscribe(
      (res: any) => {
        alert('Profile updated successfully!');
        this.fetchAdminData();
      },
      (err: any) => {
        console.error('Update failed:', err);
        alert('Profile update failed! Please try again.');
      }
    );
  }

  /** ✅ Dynamic Profile Image */
  getProfileImageUrl(): string {
    if (this.previewUrl) {
      return this.previewUrl;
    } else if (this.superadminData?.image) {
      return `http://localhost:3003/uploads/${this.superadminData.image}`;
    } else {
      return 'https://via.placeholder.com/150?text=Profile';
    }
  }
}
