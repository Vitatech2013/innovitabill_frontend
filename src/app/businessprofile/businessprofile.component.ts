import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { BillingService } from '../billing.service';

@Component({
  selector: 'app-businessprofile',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './businessprofile.component.html',
  styleUrls: ['./businessprofile.component.css']
})
export class BusinessprofileComponent implements OnInit {

  profile: any;
 BusinessprofileForm!: FormGroup;
  BusinessData: any;
  selectedImage: any;
  previewUrl: string | ArrayBuffer | null = null;
 business_id: any;

 
  addressFields = [
    { name: "house_No", label: "House No" },
    { name: "town_Name", label: "Town Name" },
    { name: "mandal_Name", label: "Mandal" },
    { name: "district_Name", label: "District" },
    { name: "state", label: "State" },
    { name: "pincode", label: "Pincode" },
  ];
businessTypes: any;
 


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private profileService: BillingService
  ) {}

  ngOnInit(): void {

 const stored = JSON.parse(localStorage.getItem('user') || '{}');

  console.log("Stored User:", stored);
  console.log("stored._id =", stored._id);

  this.business_id = stored._id; // 👈 REAL ID SET HERE
  console.log("Final business_id =", this.business_id);


    this.BusinessprofileForm = this.fb.group({
          business_name: ['', [Validators.required, Validators.minLength(3)]],
          owner_name: ['', [Validators.required, Validators.minLength(3)]],
          email: ['', [Validators.required, Validators.email]],
          phone_number: ['', [Validators.required, Validators.minLength(10)]],
          registration_number: ['', [Validators.required, Validators.minLength(3)]],
          gst_number: ['', [Validators.required, Validators.minLength(3)]],
          password: [''],
          status: ['', [Validators.required]],
          logo_image: [''],
          pan_pdf: [''],
          aadhar_pdf: [''],
          certificate_pdf: [''],
          bt_id: ['', Validators.required],
       

      address: this.fb.group({
        house_No: [''],
        town_Name: [''],
        mandal_Name: [''],
        district_Name: [''],
        state: [''],
        pincode: [''],
      })
    });

    this.fetchData();
  }

  profileedit() {
    if (!this.BusinessData) return;
    this.BusinessprofileForm.patchValue({
      business_name: this.BusinessData.business_name,
      owner_name: this.BusinessData.owner_name,
      email: this.BusinessData.email,
      phone_number: this.BusinessData.phone_number,
      bt_id: this.BusinessData.business_type,
      registration_number: this.BusinessData.registration_number,
      gst_number: this.BusinessData.gst_number,
      password: this.BusinessData.password,
      address: this.BusinessData.address,
    });
  }
fetchData() {
  console.log("Calling API with ID:", this.business_id);

  if (!this.business_id) {
    console.error("Business ID missing! Cannot fetch data.");
    return;
  }

  this.profileService.getBusinessprofile(this.business_id).subscribe({
    next: (res: any) => {
      console.log("Profile fetched:", res);

      this.BusinessData = res?.data || res;

      const { image, ...rest } = this.BusinessData;
      this.BusinessprofileForm.patchValue(rest);

      this.previewUrl = this.getImageUrl(image) + "?t=" + Date.now();
    },
    error: (err: any) => {
      console.error("Error fetching profile:", err);
    },
  });
}


   getImageUrl(image: string | null): string {
    if (!image) return '';
    return `http://78.142.47.247:3009/business_images/${image}`;
  }

  updateadminprofile() {
    if (this.BusinessprofileForm.invalid) {
      alert('Please fill all required fields');
      return;
    }

    const formData = new FormData();
    formData.append(
      'business_name',
      this.BusinessprofileForm.get('business_name')?.value
    );
    formData.append(
      'owner_name',
      this.BusinessprofileForm.get('owner_name')?.value
    );
    formData.append(
      'email',
      this.BusinessprofileForm.get('email')?.value
    );
    formData.append(
      'phone_number',
      this.BusinessprofileForm.get('phone_number')?.value
    );
    formData.append(
      'business_type',
      this.BusinessprofileForm.get('business_type')?.value
    );
    formData.append(
      'registration_number',
      this.BusinessprofileForm.get('registration_number')?.value
    );
    formData.append(
      'gst_number',
      this.BusinessprofileForm.get('gst_number')?.value
    );
     formData.append(
      'password',
      this.BusinessprofileForm.get('password')?.value
    );
    formData.append(
      'address',
      JSON.stringify(this.BusinessprofileForm.get('address')?.value)
    );

    if (this.selectedImage) {
      formData.append('logo_image', this.selectedImage);
      formData.append('pan_pdf', this.selectedImage);
      formData.append('aadhar_pdf', this.selectedImage);
      formData.append('certificate_pdf', this.selectedImage);
    }

    this.profileService.profileupdate(formData, this.BusinessData).subscribe({
      next: (res: any) => {
        alert('Profile updated successfully!');
        if (this.selectedImage) {
          const reader = new FileReader();
          reader.onload = () => {
            this.previewUrl =
              this.getImageUrl(res.data.image) + '?t=' + Date.now();
          };

          reader.readAsDataURL(this.selectedImage);
        }
        this.fetchData();
      },
      error: (err: any) => {
        console.error('Update failed:', err);
        alert('Profile update failed! Please try again.');
      },
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

  

}
