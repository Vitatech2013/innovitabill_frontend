import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BillingService } from '../billing.service';

declare var bootstrap: any;

@Component({
  selector: 'app-business-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './business-list.component.html',
  styleUrl: './business-list.component.css'
})
export class BusinessListComponent implements OnInit {
  business: any[] = [];
  BusinesForm!: FormGroup;
  selectedBusiness: any = null;
  isEditing = false;
  deleteId: string | null = null;

  constructor(private fb: FormBuilder, private api: BillingService) {}

  ngOnInit(): void {
    this.loadBusiness();

    this.BusinesForm = this.fb.group({
      business_name: ['', Validators.required],
      owner_name: ['', Validators.required],
      email: ['', Validators.email],
      phone_number: ['', Validators.required],
      business_type: ['', Validators.required],
      business_address: ['', Validators.required],
      registration_number: ['', Validators.required],
      gst_number: ['', Validators.required],
      logo_image: [''],
      pan_image: [''],
      aadhar_image: [''],
      incorporation_certificate: ['']
    });
  }

  // ✅ Load all businesses
  loadBusiness() {
    this.api.getBusiness().subscribe({
      next: (res: any) => (this.business = res || []),
      error: (err) => console.error('Error loading business:', err)
    });
  }

  // ✅ Open Add Modal
  openAddModal() {
    this.isEditing = false;
    this.BusinesForm.reset();
    const modal = new bootstrap.Modal(document.getElementById('editBusinessModal'));
    modal.show();
  }

  // ✅ Open View Modal
  openViewModal(b: any) {
    this.selectedBusiness = b;
    const modal = new bootstrap.Modal(document.getElementById('viewModal'));
    modal.show();
  }

  // ✅ Open Edit Modal
  openBusinessModal(b: any) {
    this.isEditing = true;
    this.selectedBusiness = b;
    this.BusinesForm.patchValue(b);
    const modal = new bootstrap.Modal(document.getElementById('editBusinessModal'));
    modal.show();
  }

  // ✅ Open Delete Modal
  openDeleteModal(id: string) {
    this.deleteId = id;
    const modal = new bootstrap.Modal(document.getElementById('deleteBusinessModal'));
    modal.show();
  }

  // ✅ Add or Update Business
  updateBusiness() {
    if (this.BusinesForm.invalid) return;
    const data = this.BusinesForm.value;

    if (this.isEditing && this.selectedBusiness?._id) {
      this.api.updateBusiness(this.selectedBusiness._id, data).subscribe({
        next: () => {
          this.closeModal('editBusinessModal');
          this.loadBusiness();
        },
        error: (err) => console.error('Update failed:', err)
      });
    } else {
      this.api.addBusiness(data).subscribe({
        next: () => {
          this.closeModal('editBusinessModal');
          this.loadBusiness();
        },
        error: (err) => console.error('Add failed:', err)
      });
    }
  }

  // ✅ Delete Business
  deletebusiness() {
    if (!this.deleteId) return;
    this.api.deleteBusiness(this.deleteId).subscribe({
      next: () => {
        this.closeModal('deleteBusinessModal');
        this.loadBusiness();
      },
      error: (err) => console.error('Delete failed:', err)
    });
  }

  // ✅ Close modal helper
  closeModal(id: string) {
    const modalEl = document.getElementById(id);
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  }
}
