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
  deleteId: string | null = null;
  s_id: any;
  selectedImage: string | undefined;
  selectedFiles: Record<string, File> = {};

  businessTypes: any[] = [];
  statusList: any;
  b: any;
  searchTerm: string = '';
  items: any[] = [];
  logofile: any;

  constructor(private fb: FormBuilder, private api: BillingService) {}

  ngOnInit(): void {
    this.BusinessForm = this.fb.group({
      business_name: ['', [Validators.required, Validators.minLength(3)]],
      owner_name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.minLength(10)]],
      address: ['', [Validators.required, Validators.minLength(3)]],
      registration_number: ['', [Validators.required, Validators.minLength(3)]],
      gst_number: ['', [Validators.required, Validators.minLength(3)]],
      password: [''],
      status: ['', [Validators.required]],
      logo_image: [''],
      pan_pdf: [''],
      aadhar_pdf: [''],
      certificate_pdf: [''],
      bt_id: ['', Validators.required],
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
        this.business = res.data || [];
      },
      error: (err) => console.error('Error loading business:', err),
    });
  }

  loadBusinessTypes() {
    this.api.getBusinessTypes().subscribe({
      next: (res: any) => {
        this.businessTypes = res.data || [];
      },
      error: (err: any) => console.error('Error fetching business types:', err),
    });
  }

  openViewModal(b: any) {
    this.selectedBusiness = b;
    const modal = new bootstrap.Modal(document.getElementById('viewModal'));
    modal.show();
  }

  editBusiness(b: any) {
    this.s_id = b._id;

    // const fullAddress =
    //   `${b.address.house_No}, ${b.address.town_Name}, ${b.address.mandal_Name}, ` +
    //   `${b.address.district_Name}, ${b.address.state} - ${b.address.pincode}`;

    this.BusinessForm.patchValue({
      business_name: b.business_name,
      owner_name: b.owner_name,
      email: b.email,
      phone_number: b.phone_number,
      password: '',
      bt_id: b.bt_id?._id || b.bt_id,
      address: JSON.stringify(b.address),
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

  updateBusiness() {
    const formData = new FormData();

    Object.keys(this.BusinessForm.controls).forEach((key) => {
      if (
        !['logo_image', 'pan_pdf', 'aadhar_pdf', 'certificate_pdf'].includes(
          key
        )
      ) {
        let value = this.BusinessForm.get(key)?.value;

        if (key === 'address') {
          if (typeof value === 'object') {
            value = JSON.stringify(value);
          } else {
            try {
              JSON.parse(value);
            } catch {
              value = JSON.stringify({
                house_No: '',
                town_Name: '',
                mandal_Name: '',
                district_Name: '',
                state: '',
                pincode: '',
              });
            }
          }
        }
        formData.append(key, value || '');
      }
    });

    for (const key of Object.keys(this.selectedFiles)) {
      formData.append(key, this.selectedFiles[key]);
    }

    for (const pair of (formData as any).entries()) {
      console.log('formData ->', pair[0], pair[1]);
    }

    this.api.updateBusiness(this.s_id, formData).subscribe({
      next: (res: any) => {
        this.loadBusiness();
        this.closeModal('editBusinessModal');
      },
      error: (err) => console.error('Error updating business:', err),
    });
  }

filteredItems() {
    if (!this.searchTerm) return this.items;
    const term = this.searchTerm.toLowerCase();
    return this.items.filter((it) =>
      Object.values(it).some((val) =>
        val?.toString().toLowerCase().includes(term)
      )
    );
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
      next: () => {
        this.loadBusiness();
        this.closeModal('deleteBusinessModal');
      },
      error: (err) => console.error('Error deleting business:', err),
    });
  }

  closeModal(id: string) {
    const modalEl = document.getElementById(id);
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }
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
  openImageModal(imageUrl: string) {
    this.selectedImage = imageUrl || 'assets/default-business.jpg';
    const modal = new bootstrap.Modal(
      document.getElementById('imagePreviewModal')
    );
    modal.show();
  }
}


