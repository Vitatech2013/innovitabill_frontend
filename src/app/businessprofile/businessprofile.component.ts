import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
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
  superadmin_id: any;

 
  addressFields = [
    { name: "house_No", label: "House No" },
    { name: "town_Name", label: "Town Name" },
    { name: "mandal_Name", label: "Mandal" },
    { name: "district_Name", label: "District" },
    { name: "state", label: "State" },
    { name: "pincode", label: "Pincode" },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private profileService: BillingService
  ) {}

  ngOnInit(): void {

    const stored = JSON.parse(localStorage.getItem('business') || '{}');
this.superadmin_id = stored?._id || null;



    this.BusinessprofileForm = this.fb.group({
      business_name: [''],
      owner_name: [''],
      email: [''],
      phone_number: [''],
      business_type: [''],
      registration_number: [''],
      gst_number: [''],
      password: [''],
      logo_image: [''],
      pan_pdf: [''],
      aadhar_pdf: [''],
      certificate_pdf: [''],

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
    if (this.BusinessData) {
      this.BusinessprofileForm.patchValue(this.BusinessData);
    }
  }

  fetchData() {
    if (!this.superadmin_id) return;

    this.profileService.getBusinessprofile(this.superadmin_id)
      .subscribe({
        next: (res: any) => {

          this.BusinessData = res?.data || res;

         
          this.previewUrl = this.BusinessData?.image
            ? `http://localhost:3003/uploads/${this.BusinessData.image}`
            : null;

       
          this.BusinessprofileForm.patchValue(this.BusinessData);

        
          if (this.BusinessData.address) {
            this.BusinessprofileForm.get("address")?.patchValue(this.BusinessData.address);
          }
        },
        error: (err: any) => console.error("❌ Error fetching profile:", err),
      });
  }

  onImageSelected(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  this.selectedImage = file;

  const reader = new FileReader();
  reader.onload = () => {
    this.previewUrl = reader.result; 
  };

  reader.readAsDataURL(file);
}

getImageUrl(image: string): string {
  return image
    ? `http://localhost:3009/uploads/${image}`
    : 'assets/default-profile.png';
}


  updateadminprofile() {
  if (this.BusinessprofileForm.invalid) {
    alert("Please fill all required fields");
    return;
  }

  const formData = new FormData();

  
  Object.keys(this.BusinessprofileForm.controls).forEach(key => {
    if (key !== "address") {
      formData.append(key, this.BusinessprofileForm.get(key)?.value);
    }
  });

  formData.append(
    "address",
    JSON.stringify(this.BusinessprofileForm.get("address")?.value)
  );

 
  if (this.selectedImage) {
    formData.append("logo_image", this.selectedImage);
  }

  this.profileService.businessprofileupdate(formData, this.superadmin_id)
    .subscribe({
      next: (res: any) => {
        alert("Profile updated successfully!");
        this.fetchData(); 
      },
      error: (err: any) => {
        console.error("Update failed:", err);
        alert("Profile update failed");
      }
    });
}

}
