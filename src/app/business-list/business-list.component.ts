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
import { AddBusinessComponent } from '../add-business/add-business.component';
import { RouterLink, RouterOutlet } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-business-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './business-list.component.html',
  styleUrl: './business-list.component.css',
})
export class BusinessListComponent implements OnInit {
  business: any[] = [];
  BusinessForm!: FormGroup;
  selectedBusiness: any = null;
  isEditing = false;
  deleteId: string | null = null;
  s_id: any;
  businessData: any;
  superadmin_id: any;
  businessList: any[] = [];
  selectedImage: string | undefined;
  router: any;
  addFormVisible: any;
  selectedFiles: any = {};

  constructor(private fb: FormBuilder, private api: BillingService) {}

  ngOnInit(): void {
    this.loadBusiness();

    this.BusinessForm = this.fb.group({
      business_name: ['', Validators.required],
      owner_name: ['', Validators.required],
      email: ['', Validators.email],
      phone_number: ['', Validators.required],
      business_type: ['', Validators.required],
      business_address: ['', Validators.required],
      registration_number: ['', Validators.required],
      gst_number: ['', Validators.required],
      logo_image: [''],
      pan_pdf: [''],
      aadhar_pdf: [''],
      certificate_pdf: [''],
    });
    this.api.getBusiness().subscribe((res: any) => {
      console.log(res);
      this.business = res.data;
    });
  }
  toggleAddForm() {
    this.addFormVisible = !this.addFormVisible;
  }

  onFileChange(event: any, field: string) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFiles[field] = file;
    }
  }

  openImageModal(imageUrl: string) {
    this.selectedImage = imageUrl || 'assets/default-business.jpg';
    const modal = new bootstrap.Modal(
      document.getElementById('imagePreviewModal')
    );
    modal.show();
    console.log(this.business);
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

getImageUrl(path: string): string {

  // Replace backslashes with forward slashes
  const cleanPath = path.replace(/\\/g, '/');

  // Remove any leading folder name (if duplicated)
  if (cleanPath.startsWith('business_images/')) {
    return `http://localhost:3003/${cleanPath}`;
  }

  // Otherwise, assume it's just a filename
  return `http://localhost:3003/business_images/${cleanPath}`;
}

  openAddModal() {
    this.isEditing = false;
    this.BusinessForm.reset();
    const modal = new bootstrap.Modal(
      document.getElementById('editBusinessModal')
    );
    modal.show();
  }

  openViewModal(b: any) {
    this.selectedBusiness = b;
    const modal = new bootstrap.Modal(document.getElementById('viewModal'));
    modal.show();
  }

  editBusiness(b: any) {
    console.log(b, 'edit data');
    this.s_id = b._id;
    console.log(this.s_id, 'Selected business ID');

    this.BusinessForm.patchValue({
      business_name: b.business_name,
      owner_name: b.owner_name,
      email: b.email,
      phone_number: b.phone_number,
      business_type: b.business_type,
      business_address: b.business_address,
      registration_number: b.registration_number,
      gst_number: b.gst_number,
      logo_image: b.logo_image,
      pan_pdf: b.pan_pdf,
      aadhar_pdf: b.aadhar_pdf,
      certificate_pdf: b.certificate_pdf,
    });
    console.log(this.BusinessForm.value);
    const modal = new bootstrap.Modal(
      document.getElementById('editBusinessModal')
    );
    modal.show();
  }

  openDeleteModal(id: string) {
    console.log('Delete icon clicked for:', id);
    this.deleteId = id;

    const modalEl = document.getElementById('deleteBusinessModal');
    if (modalEl) {
      let modal = bootstrap.Modal.getInstance(modalEl);
      if (!modal) {
        modal = new bootstrap.Modal(modalEl);
      }
      modal.show();
    } else {
      console.error('Modal element not found');
    }
  }

  updateBusiness() {
    const formData = new FormData();

    Object.keys(this.BusinessForm.controls).forEach((key) => {
      formData.append(key, this.BusinessForm.get(key)?.value || '');
    });

    if (this.selectedFiles['logo_image']) {
      formData.append('logo_image', this.selectedFiles['logo_image']);
    }

    if (this.selectedFiles['pan_pdf']) {
      formData.append('pan_pdf', this.selectedFiles['pan_pdf']);
    }
    if (this.selectedFiles['aadhar_pdf']) {
      formData.append('aadhar_pdf', this.selectedFiles['aadhar_pdf']);
    }
    if (this.selectedFiles['pan_pdf']) {
      formData.append('certificate_pdf', this.selectedFiles['certificate_pdf']);
    }

    console.log(this.s_id, formData);

    this.api.updateBusiness(this.s_id, formData).subscribe({
      next: (res: any) => {
        console.log('Business updated:', res);
        this.loadBusiness();
        this.closeModal('editBusinessModal');
      },
      error: (err) => {
        console.error(' Error updating business:', err);
      },
    });
  }

  deleteBusiness(id?: string | null) {
    if (!id) return;

    if (confirm('Are you sure you want to delete this business?')) {
      this.api.deletebusiness(id).subscribe({
        next: (res: any) => {
          console.log('Business deleted successfully:', res);
          this.loadBusiness();
          this.closeModal('deleteBusinessModal');
        },
        error: (err) => console.error('Error deleting business:', err),
      });
    }
  }

  closeModal(id: string) {
    const modalEl = document.getElementById('deleteBusinessModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
    (document.activeElement as HTMLElement)?.blur();
  }
}
