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

declare var bootstrap: any;

@Component({
  selector: 'app-business-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './business-list.component.html',
  styleUrls: ['./business-list.component.css'],
})
export class BusinessListComponent implements OnInit {
  business: any[] = [];
  BusinessForm!: FormGroup;
  selectedBusiness: any = null;
  isEditing = false;
  deleteId: string | null = null;
  s_id: any;
  selectedImage: string | undefined;
  selectedFiles: Record<string, File> = {};
  logofile: File | null = null;

  businessTypes: any[] = [];
  statusList: any;
  b: any;

  constructor(private fb: FormBuilder, private api: BillingService) {}

  ngOnInit(): void {
    const businesslist = localStorage.getItem('satoken');
    if (businesslist) {
      const bid = JSON.parse(businesslist);
      this.business = bid._id || '';
      console.log('businessID:', this.business);
    }

    this.BusinessForm = this.fb.group({
      business_name: ['', [Validators.required, Validators.minLength(3)]],
      owner_name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.minLength(10)]],
      bt_id: ['', Validators.required],

      address: ['', [Validators.required, Validators.minLength(3)]],
      registration_number: ['', [Validators.required, Validators.minLength(3)]],
      gst_number: ['', [Validators.required, Validators.minLength(3)]],
      password: [''],
      status: ['', [Validators.required]],
      logo_image: [''],
      pan_pdf: [''],
      aadhar_pdf: [''],
      certificate_pdf: [''],
    });
    this.loadBusinessTypes();

    this.loadBusiness();
  }

  isInvalid(controlName: string): boolean {
    const control = this.BusinessForm.get(controlName);
    return control ? control.touched && control.invalid : false;
  }

  loadBusiness() {
    this.api.getBusiness().subscribe({
      next: (res: any) => {
        console.log('Business fetched:', res);
        this.business = res.data || [];
      },
      error: (err) => console.error('Error loading business:', err),
    });
  }

  openImageModal(imageUrl: string) {
    this.selectedImage = imageUrl || 'assets/default-business.jpg';
    const modal = new bootstrap.Modal(
      document.getElementById('imagePreviewModal')
    );
    modal.show();
  }

  openViewModal(b: any) {
    this.selectedBusiness = b;
    const modal = new bootstrap.Modal(document.getElementById('viewModal'));
    modal.show();
  }

  editBusiness(b: any) {
    console.log('Edit data:', b);
    this.s_id = b._id;
    const fullAddress =
      `${b.address.house_No}, ${b.address.town_Name}, ${b.address.mandal_Name}, ` +
      `${b.address.district_Name}, ${b.address.state} - ${b.address.pincode}`;

    this.BusinessForm.patchValue({
      business_name: b.business_name,
      owner_name: b.owner_name,
      email: b.email,
      phone_number: b.phone_number,
      password: '',
      bt_id: b.bt_id?.bt_id,

      address: fullAddress,
      registration_number: b.registration_number,
      gst_number: b.gst_number,
      status: b.status || b.business_status || b.status?.status || "",
    });
    this.selectedBusiness = b;
    this.selectedFiles = {};
    if (this.logofile) {
      this.BusinessForm.get('logo_image')?.reset();
      this.BusinessForm.get('pan_pdf')?.reset();
      this.BusinessForm.get('aadhar_pdf')?.reset();
      this.BusinessForm.get('certificate_pdf')?.reset();
    }

    const modal = new bootstrap.Modal(
      document.getElementById('editBusinessModal')
    );
    modal.show();
  }

  onFileSelect(event: any, controlName: string) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFiles[controlName] = file;
      console.log('Selected file for', controlName, ':', file.name);
    }
  }

  loadBusinessTypes() {
    this.api.getBusinessTypes().subscribe({
      next: (res: any) => {
        this.businessTypes = res.data || [];
        console.log('Business Types:', this.businessTypes);
      },
      error: (err: any) => console.error('Error fetching business types:', err),
    });
    console.log('Business Types:', this.businessTypes);
  }

  getImageUrl(path: string): string {
    if (!path) return 'assets/default-business.jpg';
    const cleanPath = path.replace(/\\/g, '/');
    return cleanPath.includes('business_images/')
      ? `http://localhost:3009/${cleanPath}`
      : `http://localhost:3009/business_images/${cleanPath}`;
  }

  getFileUrl(path: string): string {
    if (!path) return '#';
    const cleanPath = path.replace(/\\/g, '/');
    return cleanPath.includes('business_images/')
      ? `http://localhost:3009/${cleanPath}`
      : `http://localhost:3009/business_images/${cleanPath}`;
  }

  updateBusiness() {
    const formData = new FormData();

    Object.keys(this.BusinessForm.controls).forEach((key) => {
      if (
        !['logo_image', 'pan_pdf', 'aadhar_pdf', 'certificate_pdf'].includes(
          key
        )
      ) {
        formData.append(key, this.BusinessForm.get(key)?.value || '');
      }
    });

    for (const key of Object.keys(this.selectedFiles)) {
      formData.append(key, this.selectedFiles[key]);
    }

    console.log('Updating business:', this.s_id, formData);

    this.api.updateBusiness(this.s_id, formData).subscribe({
      next: (res: any) => {
        console.log(' Business updated:', res);
        this.loadBusiness();
        this.closeModal('editBusinessModal');
      },
      error: (err) => {
        console.error('Error updating business:', err);
      },
    });
  }

  onCustomFileSelect(event: any, field: string) {
    const file = event.target.files[0];
    if (file) {
      this.selectedBusiness[field] = file.name;
    }
  }

  openDeleteModal(id: string) {
    this.deleteId = id;
    const modalEl = document.getElementById('deleteBusinessModal');
    if (modalEl) {
      let modal = bootstrap.Modal.getInstance(modalEl);
      if (!modal) modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  deleteBusiness(id?: string | null) {
    if (!id) return;
    this.api.deletebusiness(id).subscribe({
      next: (res: any) => {
        console.log(' Business deleted:', res);
        this.loadBusiness();
        this.closeModal('deleteBusinessModal');
      },
      error: (err) => console.error(' Error deleting business:', err),
    });
  }

  closeModal(id: string) {
    const modalEl = document.getElementById(id);
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }
  }
}
