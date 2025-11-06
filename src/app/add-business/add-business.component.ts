import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BillingService } from '../billing.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-business',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './add-business.component.html',
  styleUrl: './add-business.component.css',
})
export class AddBusinessComponent implements OnInit {
  addBusinessForm!: FormGroup;
  selectedFiles: any = {};
  sid: any;
  superadmin_id: any;
  selectedBusiness: any;
logo_image: File | null = null;
pan_pdf: File | null = null;
aadhar_pdf: File | null = null;
certificate_pdf: File | null = null;


  constructor(
    private api: BillingService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
   
const sid = JSON.parse(localStorage.getItem('superadmin') || '{}');
  this.superadmin_id = sid.data?._id;
  console.log(this.superadmin_id, 'superadminid');
     

    this.addBusinessForm = this.fb.group({
      business_name: ['', Validators.required],
      owner_name: ['', Validators.required],
      phone_number: ['', Validators.required],
      business_type: ['', Validators.required],
      business_address: ['', Validators.required],
      registration_number: ['', Validators.required],
      gst_number: ['', Validators.required],
      logo_image: [''],
      pan_image: [''],
      aadhar_pdf: [''],
      certificate_pdf: [''],
    });
  }
  



  onFileChange(event: any, fieldName: string) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFiles[fieldName] = file;
    }
  }

  cancelAdd() {
    this.addBusinessForm.reset();
  }
saveBusiness() {
  const superadmin_id = localStorage.getItem("superadmin_id");
  console.log("stored data:", superadmin_id);

  if (!superadmin_id) {
    alert("Superadmin ID missing. Please log in again.");
    return;
  }

  const formData = new FormData();
  formData.append("business_name", this.addBusinessForm.get("business_name")?.value);
  formData.append("owner_name", this.addBusinessForm.get("owner_name")?.value);
  formData.append("email", this.addBusinessForm.get("email")?.value);
  formData.append("phone_number", this.addBusinessForm.get("phone_number")?.value);
  formData.append("business_type", this.addBusinessForm.get("business_type")?.value);
  formData.append("business_address", this.addBusinessForm.get("business_address")?.value);
  formData.append("registration_number", this.addBusinessForm.get("registration_number")?.value);
  formData.append("gst_number", this.addBusinessForm.get("gst_number")?.value);
  formData.append("password", this.addBusinessForm.get("password")?.value);
  formData.append("superadmin_id", superadmin_id);  


  if (this.logo_image) formData.append("logo_image", this.logo_image);
  if (this.pan_pdf) formData.append("pan_pdf", this.pan_pdf);
  if (this.aadhar_pdf) formData.append("aadhar_pdf", this.aadhar_pdf);
  if (this.certificate_pdf) formData.append("certificate_pdf", this.certificate_pdf);

  this.api.addBusiness(formData).subscribe({
    next: (res: any) => {
      console.log("Business registered:", res);
      alert("Business registered successfully!");
      this.addBusinessForm.reset();
    },
    error: (err) => {
      console.error("Add failed:", err);
    },
  });
}

}
