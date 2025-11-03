import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BillingService } from '../billing.service';
import { Router } from '@angular/router';
import { compileComponentClassMetadata } from '@angular/compiler';

declare var bootstrap: any;

@Component({
  selector: 'app-admins',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './admins.component.html',
  styleUrl: './admins.component.css'
})
export class AdminsComponent implements OnInit {


admins: any[] = [];
  adminsForm!: FormGroup;
  adminId: string = '';
  deleteAdminId: string = '';
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private api: BillingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAdmins();

    this.adminsForm = this.fb.group({
      full_name: ['', Validators.required],
      email: ['', Validators.required],
      phone_number: ['', Validators.required],
      address: this.fb.group({
        house_No: ['', Validators.required],
        town_Name: ['', Validators.required],
        mandal_Name: ['', Validators.required],
        district_Name: ['', Validators.required],
        state: ['', Validators.required],
        pincode: ['', Validators.required],
      }),
      business_id: [''],
      status: ['Active'],
    });
  }

  // ✅ Load Admins
  loadAdmins() {
    this.api.getAdmins().subscribe({
      next: (res: any[]) => {
        this.admins = res || [];
        console.log('Admins Are:', this.admins);
      },
      error: (err: any) => {
        console.error('Error fetching admins:', err);
      },
    });
  }

  // ✅ File Selection
  onFileSelected(event: any) {
  this.selectedFile = event.target.files[0] || null;
}

  // ✅ Open Add Modal
  openAddModal() {
    this.adminId = '';
    this.adminsForm.reset();
    const modal = new bootstrap.Modal(
      document.getElementById('editadminModal')
    );
    modal.show();
  }

  // ✅ Open Edit Modal
  openAdminModal(admin: any) {
    this.adminId = admin._id;
    this.adminsForm.patchValue(admin);

    const modal = new bootstrap.Modal(
      document.getElementById('editadminModal')
    );
    modal.show();
  }

  // ✅ Update Admin
  updateAdmin() {
    if (this.adminsForm.invalid) return;

    const formData = new FormData();
    Object.entries(this.adminsForm.value).forEach(([key, value]: any) => {
      if (key === 'address') {
        Object.entries(value).forEach(([subKey, subVal]: any) => {
          formData.append(`address[${subKey}]`, subVal);
        });
      } else {
        formData.append(key, value);
      }
    });

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.api.updateAdmin(this.adminId, formData).subscribe({
      next: () => {
        alert('Admin updated successfully');
        this.loadAdmins();
        const modalEl = document.getElementById('editadminModal');
        if (modalEl) {
          const modal = bootstrap.Modal.getInstance(modalEl);
          modal?.hide();
        }
      },
      error: (err: any) => {
        console.error('Error updating admin:', err);
      },
    });
  }

  // ✅ Open Delete Modal
  openDeleteModal(id: string) {
    console.log('Deleting Admin ID:', id);
    this.deleteAdminId = id;

    const modal = new bootstrap.Modal(
      document.getElementById('deleteAdminModal')
    );
    modal.show();
  }

  // ✅ Delete Admin
  deleteAdmin() {
    if (!this.deleteAdminId) return;

    this.api.deleteAdmin(this.deleteAdminId).subscribe({
      next: () => {
        alert('Admin deleted successfully');
        this.loadAdmins();

        const modalEl = document.getElementById('deleteAdminModal');
        if (modalEl) {
          const modal = bootstrap.Modal.getInstance(modalEl);
          modal?.hide();
        }
      },
      error: (err: any) => {
        console.error('Error deleting admin:', err);
      },
    });
  }
}