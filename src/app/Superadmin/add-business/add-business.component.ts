import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router } from '@angular/router';
import { BillingService } from '../../Services/billing.service';

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
  activeBusinessTypes: any[] = [];
  addressFields = [
    { label: 'House No', name: 'house_No' },
    { label: 'Town Name', name: 'town_Name' },
    { label: 'Mandal Name', name: 'mandal_Name' },
    { label: 'District Name', name: 'district_Name' },
    { label: 'State', name: 'state' },
    { label: 'pincode', name: 'pincode', text: 'number' },
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
      business_name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[A-Za-z]+( [A-Za-z]+)*$/),
        ],
      ],
      owner_name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[A-Za-z]+( [A-Za-z]+)*$/),
        ],
      ],
      email: [
        '',
        [Validators.required, Validators.email, Validators.pattern(/^\S+$/)],
      ],
      phone_number: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
      ],
      bt_id: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^\S+$/),
        ],
      ],
      registration_number: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^\S+$/),
          Validators.pattern(/^[A-Za-z0-9]+$/),
        ],
      ],
      gst_number: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^\S+$/),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/
          ),
        ],
      ],
      address: this.fb.group({
        house_No: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern(/^\S+$/),
          ],
        ],
        town_Name: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern(/^\S+$/),
            Validators.pattern(/^[A-Za-z ]+$/),
          ],
        ],
        mandal_Name: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern(/^\S+$/),
            Validators.pattern(/^[A-Za-z ]+$/),
          ],
        ],
        district_Name: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern(/^\S+$/),
            Validators.pattern(/^[A-Za-z ]+$/),
          ],
        ],
        state: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern(/^\S+$/),
            Validators.pattern(/^[A-Za-z ]+$/),
          ],
        ],
        pincode: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern(/^[0-9]{6}$/),
          ],
        ],
      }),
      logo_image: ['', Validators.required],
      pan_pdf: ['', Validators.required],
      aadhar_pdf: ['', Validators.required],
      certificate_pdf: ['', Validators.required],
    });
    this.loadBusinessTypes();
  }
  preventSpace(event: KeyboardEvent) {
    if (event.code === 'Space') {
      event.preventDefault();
    }
  }
  // onNameInput(event: Event, controlName: string) {
  //   const input = event.target as HTMLInputElement;

  //   const value = input.value
  //     .replace(/[^A-Za-z ]/g, '')
  //     .replace(/\s+/g, ' ')
  //     .trimStart();

  //   this.addBusinessForm
  //     .get(controlName)
  //     ?.setValue(value, { emitEvent: false });
  // }
  onNameInput(event: Event, controlName: string) {
  const input = event.target as HTMLInputElement;

  let value = input.value
    .replace(/[^A-Za-z ]/g, '')   // only alphabets + space
    .replace(/\s+/g, ' ')         // single space
    .trimStart();

  // ✅ Capitalize first letter of each word
  value = value
    .split(' ')
    .map(word =>
      word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : ''
    )
    .join(' ');

  this.addBusinessForm
    .get(controlName)
    ?.setValue(value, { emitEvent: false });
}
  allowOnlyDigits(event: KeyboardEvent) {
  const key = event.key;

  if (key.length > 1) return;

  if (!/^\d$/.test(key)) {
    event.preventDefault();
  }
}


  loadBusinessTypes() {
    this.api.getBusinessTypes().subscribe({
      next: (res: any) => {
        console.log('API RESPONSE ', res);

        this.activeBusinessTypes = (res.data || []).filter(
          (type: any) => type.status?.toLowerCase() === 'active'
        );

        console.log('ONLY ACTIVE ', this.activeBusinessTypes);
      },
      error: (err) => {
        console.error('Error loading business types', err);
      },
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
    const fileType = file.type;
    const fileSize = file.size / 1024 / 1024;

    if (fieldName === 'logo_image') {
      const validImageTypes = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'image/webp',
      ];

      if (!validImageTypes.includes(fileType)) {
        this.addBusinessForm.get(fieldName)?.setErrors({ invalidType: true });
        return;
      }

      if (fileSize > 2) {
        this.addBusinessForm.get(fieldName)?.setErrors({ maxSize: true });
        return;
      }
    }

    if (['pan_pdf', 'aadhar_pdf', 'certificate_pdf'].includes(fieldName)) {
      if (fileType !== 'application/pdf') {
        this.addBusinessForm.get(fieldName)?.setErrors({ invalidType: true });
        return;
      }

      if (fileSize > 5) {
        this.addBusinessForm.get(fieldName)?.setErrors({ maxSize: true });
        return;
      }
    }

    this.addBusinessForm.patchValue({
      [fieldName]: file,
    });

    this.addBusinessForm.get(fieldName)?.updateValueAndValidity();
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
         if (err.error?.message === 'Email already exists') {
      this.addBusinessForm.get('email')?.setErrors({ emailExists: true });
    }
    formData.append('action', 'active'); 
    
        console.error('Add failed:', err);
        if (err?.error?.missing_fields) {
          this.showToast('Missing fields: ' + err.error.missing_fields.join(', '));
        } else {
          this.showToast('Failed to register business.', 'error');
        }
      },
    });
  }
  showToast(message: string, type: string = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => (this.toastMessage = null), 1000);
  }
}    


