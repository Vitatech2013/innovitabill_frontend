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
import { BillingService } from '../billing.service';
import { constants } from '../../../constants';
declare var bootstrap: any;

@Component({
  selector: 'app-businessprofile',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './businessprofile.component.html',
  styleUrls: ['./businessprofile.component.css'],
})
export class BusinessprofileComponent implements OnInit {
  profile: any;
  BusinessprofileForm!: FormGroup;
  BusinessData: any;
  selectedImage: any;
  previewUrl: string | ArrayBuffer | null = null;
  business_id: any;

  addressFields = [
    { name: 'house_No', label: 'House No' },
    { name: 'town_Name', label: 'Town Name' },
    { name: 'mandal_Name', label: 'Mandal' },
    { name: 'district_Name', label: 'District' },
    { name: 'state', label: 'State' },
    { name: 'pincode', label: 'Pincode' },
  ];
  businessTypes: any[] = [];
  selectedBusiness: any;
  pan_file: any;
  aadhar_file: any;
  certificate_file: any;
  logo_file: any;
  toastType: any;
  toastMessage: any;
  selectedBusinessType: any;
  private baseUrl = constants.baseUrl;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private profileService: BillingService
  ) {}

  ngOnInit(): void {
    const stored = JSON.parse(localStorage.getItem('user') || '{}');

    console.log('Stored User:', stored);
    console.log('stored._id =', stored._id);

    this.business_id = stored._id; // 👈 REAL ID SET HERE
    console.log('Final business_id =', this.business_id);

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
        house_No: [''],
        town_Name: [''],
        mandal_Name: [''],
        district_Name: [''],
        state: [''],
        pincode: [''],
      }),
    });

    this.fetchData();
    this.loadBusinessTypes();
  }

  loadBusinessTypes() {
    this.profileService.getBusinessTypes().subscribe({
      next: (res: any) => {
        this.businessTypes = res.data || [];
      },
      error: (err: any) => console.error('Error fetching business types:', err),
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
  }
  updateadminprofile() {
    if (this.BusinessprofileForm.invalid) {
      this.showToast('Please fill all required fields', 'warning');
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
    formData.append('email', this.BusinessprofileForm.get('email')?.value);
    formData.append(
      'phone_number',
      this.BusinessprofileForm.get('phone_number')?.value
    );
    formData.append('bt_id', this.BusinessprofileForm.get('bt_id')?.value);

    formData.append(
      'registration_number',
      this.BusinessprofileForm.get('registration_number')?.value
    );
    formData.append(
      'gst_number',
      this.BusinessprofileForm.get('gst_number')?.value
    );
    // const newPassword = this.BusinessprofileForm.value.password;

    // if (newPassword && newPassword.trim() !== '') {
    //   formData.append('password', newPassword);
    // }
    formData.append(
      'address',
      JSON.stringify(this.BusinessprofileForm.get('address')?.value)
    );

    if (this.logo_file) formData.append('logo_image', this.logo_file);
    if (this.pan_file) formData.append('pan_pdf', this.pan_file);
    if (this.aadhar_file) formData.append('aadhar_pdf', this.aadhar_file);
    if (this.certificate_file)
      formData.append('certificate_pdf', this.certificate_file);

    this.profileService
      .businessprofileupdate(formData, this.BusinessData._id)
      .subscribe({
        next: (res: any) => {
          this.showToast('Profile updated successfully!', 'success');
          if (this.selectedImage) {
            const reader = new FileReader();
            reader.onload = () => {
              this.previewUrl =
                this.getImageUrl(res.data.image) + '?t=' + Date.now();
            };

            reader.readAsDataURL(this.selectedImage);
          }
          this.fetchData();
          const modal = bootstrap.Modal.getInstance(
            document.getElementById('editProfileModal')
          );
          modal.hide();
        },
        error: (err: any) => {
          console.error('Update failed:', err);
          this.showToast('Profile update failed! Please try again.', 'error');
        },
      });
  }
  showToast(message: string, type: 'success' | 'error' | 'warning') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => (this.toastMessage = null), 3000);
  }

  // fetchData() {
  //   console.log('Calling API with ID:', this.business_id);

  //   if (!this.business_id) {
  //     console.error('Business ID missing! Cannot fetch data.');
  //     return;
  //   }

  //   this.profileService.getBusinessprofile(this.business_id).subscribe({
  //     next: (res: any) => {
  //       console.log('Profile fetched:', res);

  //       this.BusinessData = res?.data || res;

  //       this.previewUrl =
  //         this.getImageUrl(this.BusinessData.image) + '?t=' + Date.now();

  //       const { image, ...rest } = this.BusinessData;
  //       this.BusinessprofileForm.patchValue(rest);
  //     },
  //     error: (err) => console.error(' Error fetching admin profile:', err),
  //   });
  // }
  fetchData() {
    console.log('Calling API with ID:', this.business_id);

    if (!this.business_id) {
      console.error('Business ID missing! Cannot fetch data.');
      return;
    }

    this.profileService.getBusinessprofile(this.business_id).subscribe({
      next: (res: any) => {
        console.log('Profile fetched:', res);

        this.BusinessData = res?.data || res;

        // Set preview image
        this.previewUrl =
          this.getImageUrl(this.BusinessData.logo_image) + '?t=' + Date.now();

        // Patch form values
        const { image, pan_pdf, aadhar_pdf, certificate_pdf, ...rest } =
          this.BusinessData;
        this.BusinessprofileForm.patchValue(rest);

        // Populate selected files for display
        this.selectedBusiness = {
          logo_image: this.BusinessData.logo_image || '',
          pan_pdf: this.BusinessData.pan_pdf || '',
          aadhar_pdf: this.BusinessData.aadhar_pdf || '',
          certificate_pdf: this.BusinessData.certificate_pdf || '',
        };
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

  getImageUrl(image: string | null): string {
    if (!image) return '';
    // return `http://78.142.47.247:3009/business_images/${image}`;
    return `${this.baseUrl}/business_images/${image}`;
  }

  onCustomFileSelect(event: any, field: string) {
    const file = event.target.files[0];
    if (file) {
      this.selectedBusiness[field] = file.name;
    }
  }

  onLogoSelected(event: any) {
    this.logo_file = event.target.files[0];
  }

  onPanSelected(event: any) {
    this.pan_file = event.target.files[0];
  }

  onAadharSelected(event: any) {
    this.aadhar_file = event.target.files[0];
  }

  onCertificateSelected(event: any) {
    this.certificate_file = event.target.files[0];
  }
}
