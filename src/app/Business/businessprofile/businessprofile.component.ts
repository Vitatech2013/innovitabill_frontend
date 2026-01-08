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

declare var bootstrap: any;

@Component({
  selector: 'app-businessprofile',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './businessprofile.component.html',
  styleUrls: ['./businessprofile.component.css'],
})
export class BusinessprofileComponent implements OnInit {
  baseUrl: string = 'http://localhost:3009';
  BusinessprofileForm!: FormGroup;
  BusinessData: any;
  previewUrl: string | ArrayBuffer | null = null;
  business_id: any;

addressFields = [
  { name: 'house_No', label: 'House No' },
  { name: 'town_Name', label: 'Town Name' },
  { name: 'mandal_Name', label: 'Mandal' },
  { name: 'district_Name', label: 'District' },
  { name: 'state', label: 'State' },
  { name: 'pincode', label: 'Pincode' }
];

  businessTypes: any[] = [];
  selectedBusiness: any = {};
  pan_file: any;
  aadhar_file: any;
  certificate_file: any;
  logo_file: any;
  toastType: any;
  toastMessage: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private profileService: BillingService
  ) {}

  ngOnInit(): void {
    const stored = JSON.parse(localStorage.getItem('user') || '{}');
    this.business_id = stored._id;

    this.BusinessprofileForm = this.fb.group({
      business_name: ['', [Validators.required, Validators.minLength(3)]],
      owner_name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.minLength(10)]],
      registration_number: ['', [Validators.required, Validators.minLength(3)]],
      gst_number: ['', [Validators.required, Validators.minLength(3)]],
      password: [''],
      status: ['', [Validators.required]],
      pan_pdf: [''],
      aadhar_pdf: [''],
      certificate_pdf: [''],
      logo_image: [''],
      bt_id: ['', Validators.required],
      address: this.fb.group({
        house_No: ['', Validators.required],
        town_Name: ['', Validators.required],
        mandal_Name: ['', Validators.required],
        district_Name: ['', Validators.required],
        state: ['', Validators.required],
        pincode: ['', Validators.required],
      }),
    });

    this.loadBusinessTypes();
    this.fetchData();
  }

  loadBusinessTypes() {
    this.profileService.getBusinessTypes().subscribe({
      next: (res: any) => (this.businessTypes = res.data || []),
      error: (err: any) => console.error(err),
    });
  }

  profileedit() {
    if (!this.BusinessData) return;

    this.BusinessprofileForm.patchValue({
      business_name: this.BusinessData.business_name,
      owner_name: this.BusinessData.owner_name,
      email: this.BusinessData.email,
      phone_number: this.BusinessData.phone_number,
      bt_id: this.BusinessData.bt_id?._id || this.BusinessData.bt_id,
      registration_number: this.BusinessData.registration_number,
      gst_number: this.BusinessData.gst_number,
      password: '',
      pan_pdf: this.BusinessData.pan_pdf,
      aadhar_pdf: this.BusinessData.aadhar_pdf,
      certificate_pdf: this.BusinessData.certificate_pdf,
      logo_image: this.BusinessData.logo_image,
      address: this.BusinessData.address,
    });

    this.selectedBusiness = {
      logo_image: this.BusinessData.logo_image || '',
      pan_pdf: this.BusinessData.pan_pdf || '',
      aadhar_pdf: this.BusinessData.aadhar_pdf || '',
      certificate_pdf: this.BusinessData.certificate_pdf || '',
    };
  }

  fetchData() {
    if (!this.business_id) return;

    this.profileService.getBusinessprofile(this.business_id).subscribe({
      next: (res: any) => {
        this.BusinessData = res?.data || res;
        this.previewUrl =
          this.getImageUrl(this.BusinessData.logo_image) + '?t=' + Date.now();

        const { logo_image, pan_pdf, aadhar_pdf, certificate_pdf, ...rest } =
          this.BusinessData;
        this.BusinessprofileForm.patchValue(rest);

        this.selectedBusiness = {
          logo_image: this.BusinessData.logo_image || '',
          pan_pdf: this.BusinessData.pan_pdf || '',
          aadhar_pdf: this.BusinessData.aadhar_pdf || '',
          certificate_pdf: this.BusinessData.certificate_pdf || '',
        };
      },
      error: (err) => console.error('Fetch failed:', err),
    });
  }

  updateadminprofile() {
    if (this.BusinessprofileForm.invalid) {
      this.BusinessprofileForm.markAllAsTouched();
      this.showToast('Please fill all required fields', 'warning');
      return;
    }

    const formData = new FormData();
    const formValue = this.BusinessprofileForm.value;

    formData.append('business_name', formValue.business_name);
    formData.append('owner_name', formValue.owner_name);
    formData.append('email', formValue.email);
    formData.append('phone_number', formValue.phone_number);
    formData.append('bt_id', formValue.bt_id);
    formData.append('registration_number', formValue.registration_number);
    formData.append('gst_number', formValue.gst_number);
    formData.append('address', JSON.stringify(formValue.address));

    if (this.logo_file) formData.append('logo_image', this.logo_file);
    if (this.pan_file) formData.append('pan_pdf', this.pan_file);
    if (this.aadhar_file) formData.append('aadhar_pdf', this.aadhar_file);
    if (this.certificate_file)
      formData.append('certificate_pdf', this.certificate_file);

    if (!this.BusinessData?._id) {
      console.error('Business ID missing!');
      return;
    }

    this.profileService
      .businessprofileupdate(formData, this.BusinessData._id)
      .subscribe({
        next: (res: any) => {
          this.showToast('Profile updated successfully!', 'success');
          this.fetchData();

          const modalEl = document.getElementById('editProfileModal');
          if (modalEl) {
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal?.hide();
          }
        },
        error: (err: any) => {
          console.error('Update failed:', err);
          this.showToast('Profile update failed!', 'error');
        },
      });
  }

  showToast(message: string, type: 'success' | 'error' | 'warning') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => (this.toastMessage = null), 3000);
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.logo_file = file;
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result);
      reader.readAsDataURL(file);
    }
  }

  onPanSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.pan_file = file;
      this.selectedBusiness.pan_pdf = file.name;
    }
  }

  onAadharSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.aadhar_file = file;
      this.selectedBusiness.aadhar_pdf = file.name;
    }
  }

  onCertificateSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.certificate_file = file;
      this.selectedBusiness.certificate_pdf = file.name;
    }
  }

  onCustomFileSelect(event: any, field: string) {
    const file = event.target.files[0];
    if (!file) return;
    this.selectedBusiness[field] = file.name;

    switch (field) {
      case 'pan_pdf':
        this.pan_file = file;
        break;
      case 'aadhar_pdf':
        this.aadhar_file = file;
        break;
      case 'certificate_pdf':
        this.certificate_file = file;
        break;
      case 'logo_image':
        this.logo_file = file;
        break;
    }
  }

  getImageUrl(image: string | null): string {
    if (!image) return '';
    return `http://localhost:3009/business_images/${image}`;
  }

  allowOnlyLetters(event: KeyboardEvent) {
    if (!/^[A-Za-z]$/.test(event.key)) event.preventDefault();
  }
  onlyDigits(event: KeyboardEvent, max: number) {
    const el = event.target as HTMLInputElement;
    if (event.key.length > 1) return;
    if (!/\d/.test(event.key) || el.value.length >= max) event.preventDefault();
  }
   removeFirstSpace() {
    const c = this.BusinessprofileForm.get('business_name');
    if (c?.value?.startsWith(' ')) {
      c.setValue(c.value.trimStart(), { emitEvent: false });
    }
  }
  removeExtraSpaces() {
  const control = this.BusinessprofileForm.get('business_name');
  if (control) {
    let value = control.value || '';

    value = value.replace(/^\s+/, '');

    
    value = value.replace(/\s{2,}/g, ' ');

    control.setValue(value, { emitEvent: false });
  }
}
 allowOnlyLettersAndSingleSpace(event: KeyboardEvent) {
  const inputChar = event.key;
  const currentValue = (event.target as HTMLInputElement).value;

  if (/^[a-zA-Z]$/.test(inputChar)) {
    return;
  }

  if (
    inputChar === ' ' &&
    currentValue.length > 0 &&
    !currentValue.endsWith(' ')
  ) {
    return;
  }

  event.preventDefault();
}
blockSpace(event: KeyboardEvent) {
  if (event.key === ' ') {
    event.preventDefault();
  }
}
handleAddressKeyPress(event: KeyboardEvent, fieldName: string) {
  switch (fieldName) {
    case 'town_Name':
    case 'mandal_Name':
    case 'district_Name':
      this.allowOnlyLettersAndSingleSpace(event);
      break;

    case 'state':
      this.allowOnlyLetters(event);
      break;

    case 'pincode':
      this.onlyDigits(event, 6);
      break;

    case 'house_No':
      // allow letters + numbers, block starting space
      if (event.key === ' ') {
        this.blockSpace(event);
      }
      break;
  }
}

}
