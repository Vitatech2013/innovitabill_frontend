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
  businessTypes: any[] = [];
   toastMessage: string | null = null;
  toastType: string | undefined;

  addressFields = [
    { label: 'House No', name: 'house_No' },
    { label: 'Town Name', name: 'town_Name' },
    { label: 'Mandal Name', name: 'mandal_Name' },
    { label: 'District Name', name: 'district_Name' },
    { label: 'State', name: 'state' },
    { label: 'pincode', name: 'pincode' },
  ];

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
      bt_id: ['', [Validators.required, Validators.minLength(3)]],
      registration_number: ['', [Validators.required, Validators.minLength(3)]],
      gst_number: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],

      address: this.fb.group({
        house_No: ['', [Validators.required, Validators.minLength(3)]],
        town_Name: ['', [Validators.required, Validators.minLength(3)]],
        mandal_Name: ['', [Validators.required, Validators.minLength(3)]],
        district_Name: ['', [Validators.required, Validators.minLength(3)]],
        state: ['', [Validators.required, Validators.minLength(3)]],
        pincode: ['', [Validators.required, Validators.minLength(3)]],
      }),
      logo_image: [''],
      pan_pdf: [''],
      aadhar_pdf: [''],
      certificate_pdf: [''],
    });
    this.loadBusinessTypes();
  }
  loadBusinessTypes() {
    this.api.getBusinessTypes().subscribe({
      next: (res: any) => {
        this.businessTypes = res.data || [];
        console.log('Business Types:', this.businessTypes);
      },
      error: (err: any) => console.error('Error fetching business types:', err),
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
  this.addBusinessForm.get('address')?.reset();
  this.selectedFiles = {};
  this.showToast('Form cleared', 'error');
}


 saveBusiness() {
  if (this.addBusinessForm.invalid) {
   this.showToast('Please fill all required fields correctly.', 'error');
  this.addBusinessForm.markAllAsTouched();
    return;
  }

  const formData = new FormData();

  Object.keys(this.addBusinessForm.controls).forEach((key) => {
    const control = this.addBusinessForm.get(key);

    if (key === 'address') {
      const addr = control?.value;
      formData.append('address', JSON.stringify(addr));
    } else {
      
      if (control?.value && typeof control.value === 'string') {
        formData.append(key, control.value);
      }
    }
  });


  formData.append('superadmin_id', this.superadmin_id);


  for (const key in this.selectedFiles) {
    formData.append(key, this.selectedFiles[key]);
  }

 formData.forEach((value, key) => {
  console.log(key, value);
});


  this.api.addBusiness(formData).subscribe({
    next: (res) => {
    this.showToast('Business registered successfully!', 'success');
setTimeout(() => {
  this.router.navigate(['SuperAdminView']);
}, 500);


      
    },
    error: (err) => {
      console.error('Add failed:', err);
      if (err?.error?.missing_fields) {
        alert('Missing fields: ' + err.error.missing_fields.join(', '));
      } else {
        alert('Failed to register business.');
      }
    },
  });
}
 showToast(message: string, type: string = 'success') {
  this.toastMessage = message;
  this.toastType = type;
  setTimeout(() => (this.toastMessage = null), 3000);
}



}
