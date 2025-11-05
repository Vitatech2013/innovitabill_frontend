import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BillingService } from '../billing.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-business',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './add-business.component.html',
  styleUrl: './add-business.component.css'
})
export class AddBusinessComponent implements OnInit {
  addFormVisible = false;
  addBusinessForm!: FormGroup;
  sid: any;
  
  selectedFiles: any = {};

  constructor(private api: BillingService, private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    const s = JSON.parse(localStorage.getItem('superadmin_id') || '{}');
    this.sid = s.data?._id;
    console.log(this.sid, 'sid');

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
      aadhar_image: [''],
      incorporation_certificate: [''],
    });
  }

  toggleAddForm() {
    this.addFormVisible = !this.addFormVisible;
  }


onFileChange(event: any, fieldName: string) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFiles[fieldName] = file;
    }
  }





  cancelAdd() {
    this.addFormVisible = false;
    this.addBusinessForm.reset();
  }

  addbusiness() {
    if (!this.addBusinessForm.valid) return;

    console.log(this.addBusinessForm.value, "Form submitted");

    this.api.addBusiness(this.addBusinessForm.value).subscribe({
      next: (res: any) => {
        console.log('Business added:', res);
        alert('Business added successfully!');
        this.cancelAdd(); 
      },
      error: (err: any) => {
        console.error('Error adding business', err);
      },
    });
  }
}
