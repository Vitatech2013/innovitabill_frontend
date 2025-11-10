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
  styleUrls: ['./add-business.component.css'],
})
export class AddBusinessComponent implements OnInit {

  addBusinessForm!: FormGroup;
  selectedFiles: { [key: string]: File } = {};
  superadmin_id: string = '';
selectedBusiness: any;

  constructor(
    private api: BillingService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
   
    const saData = JSON.parse(localStorage.getItem('sa') || '{}');
    this.superadmin_id = saData._id;
    console.log('Superadmin ID:', this.superadmin_id);


    
    if (!this.superadmin_id) {
      alert('Superadmin ID missing. Please login again.');
      this.router.navigate(['SuperAdminLogin']); 
    }

    this.addBusinessForm = this.fb.group({
       business_name: ['', [Validators.required, Validators.minLength(3)]],
      owner_name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.minLength(10)]],
      business_type: ['', [Validators.required, Validators.minLength(3)]],
      business_address: ['', [Validators.required, Validators.minLength(3)]],
      registration_number: ['', [Validators.required, Validators.minLength(3)]],
      gst_number: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      logo_image: [''],
      pan_pdf: [''],
      aadhar_pdf: [''],
      certificate_pdf: [''],
    });
  }
  isInvalid(controlName: string): boolean {
    const control = this.addBusinessForm.get(controlName);
    return control ? control.touched && control.invalid : false;
  }

  onFileChange(event: any, fieldName: string) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFiles[fieldName] = file;
    }
  }


  cancelAdd() {
    this.addBusinessForm.reset();
    this.selectedFiles = {};
  }

  saveBusiness() {
    if (!this.superadmin_id) {
      console.error('Superadmin ID missing. Please login again.');
      return;
    }

    if (this.addBusinessForm.invalid) {
      alert('Please fill all required fields correctly.');
      return;
    }

    
    const formData = new FormData();

  
    Object.keys(this.addBusinessForm.value).forEach((key) => {
      if (this.addBusinessForm.get(key)?.value) {
        formData.append(key, this.addBusinessForm.get(key)?.value);
      }
    });

    
    formData.append('superadmin_id', this.superadmin_id)
    
    for (const key in this.selectedFiles) {
      formData.append(key, this.selectedFiles[key]);
    }

    console.log('Sending formData:', formData);
   
    this.api.addBusiness(formData).subscribe({
      next: (res: any) => {
        console.log('Business added successfully:', res);
         localStorage.setItem('superadmin', JSON.stringify(res));

   
    this.router.navigate(['SuperAdminView']);
  
        alert('Business registered successfully!');
        this.addBusinessForm.reset();
        this.selectedFiles = {};
      },
      error: (err) => {
        console.error('Add failed:', err);
        alert('Failed to add business. Please check the console.');
      },
    });
  }
}
