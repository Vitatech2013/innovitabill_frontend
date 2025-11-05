import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BillingService } from '../billing.service';
=======
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BillingService } from '../billing.service';
import { AddBusinessComponent } from '../add-business/add-business.component';
import { RouterLink } from "@angular/router";
>>>>>>> f75029af8a891d60dfeb82945ffac0b8e2f1bb2d

declare var bootstrap: any;

@Component({
  selector: 'app-business-list',
  standalone: true,
<<<<<<< HEAD
  imports: [CommonModule, ReactiveFormsModule],
=======
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
>>>>>>> f75029af8a891d60dfeb82945ffac0b8e2f1bb2d
  templateUrl: './business-list.component.html',
  styleUrls: ['./business-list.component.css'],
})
export class BusinessListComponent implements OnInit {
<<<<<<< HEAD
  toastMessage: string | null = null;
  business: any;
  BusinesForm!: FormGroup;
  selectedBusinessId: string | null = null;
  deleteBusinessId: string | null = null;
  superadminId: any;
 SA_Token:any;

  constructor(
    private api: BillingService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadBusiness();

    // Show toast message if redirected with state
    this.toastMessage = history.state?.toast || null;
    if (this.toastMessage) {
      setTimeout(() => (this.toastMessage = null), 3000);
    }

    const saId = JSON.parse(localStorage.getItem('superAdmin') || '{}');
    this.superadminId = saId._id;
    console.log(this.superadminId, 'Super Admin ID');

    const sa_token=localStorage.getItem("sa_token")
    this.SA_Token=sa_token;
    console.log(this.SA_Token,"SAToken")
  }


  private initializeForm(): void {
    this.BusinesForm = this.fb.group({
      business_name: ['', Validators.required],
      owner_name: ['', Validators.required],
      phone_number: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
      ],
      business_type: ['', Validators.required],
      business_address: ['', Validators.required],
      registration_number: ['', Validators.required],
      gst_number: ['', Validators.required],
      password: ['', Validators.required],
      logo_image: ['', Validators.required],
      pan_image: ['', Validators.required],
      aadhar_image: ['', Validators.required],
      incorporation_certificate: ['', Validators.required],
      superadmin_id: this.superadminId,
    });
  }

  // ✅ Get all businesses
  loadBusiness(): void {
    this.api.getBusiness().subscribe({
      next: (res: any) => {
        this.business = res || [];
        console.log('Business list:', this.business);
      },
      error: (err) => console.error('Error fetching business list:', err),
    });
  }

  // ✅ Add a new business
  addbusiness(): void {
    if (this.BusinesForm.invalid) return;
const formData = new FormData();
  formData.append('business_name', this.BusinesForm.value.business_name);
  formData.append('owner_name', this.BusinesForm.value.owner_name);
  formData.append('phone_number', this.BusinesForm.value.phone_number);
  formData.append('business_type', this.BusinesForm.value.business_type);
  formData.append('business_address', this.BusinesForm.value.business_address);
  formData.append('registration_number', this.BusinesForm.value.registration_number);
  formData.append('gst_number', this.BusinesForm.value.gst_number);
  formData.append('password', this.BusinesForm.value.password);
  formData.append('superadmin_id', this.superadminId);
    // const newBusiness: any = this.BusinesForm.value;
    this.api.addBusiness(formData).subscribe({
      next: (res) => {
        console.log('Business added:', res);
        this.loadBusiness();
        this.BusinesForm.reset();
      },
      error: (err) => console.error('Error adding business:', err),
    });
  }

  // ✅ Open Edit Modal and patch values
  openBusinessModal(business: any): void {
    this.selectedBusinessId = business._id || '';
    this.BusinesForm.patchValue(business);

    const modal = new bootstrap.Modal(
      document.getElementById('editBusinessModal')
    );
    modal.show();
  }

  // ✅ Update business
  updateBusiness(): void {
    if (this.BusinesForm.invalid || !this.selectedBusinessId) return;

    this.api
      .updateBusiness(this.selectedBusinessId, this.BusinesForm.value)
      .subscribe({
        next: () => {
          const modalEl = document.getElementById('editBusinessModal');
          const modal = bootstrap.Modal.getInstance(modalEl);
          modal.hide();

          this.loadBusiness();
          console.log('Business updated successfully');
        },
        error: (err) => console.error('Error updating business:', err),
      });
  }

  // ✅ Open Delete Confirmation Modal
  openDeleteModal(id: string): void {
    this.deleteBusinessId = id;
    const modal = new bootstrap.Modal(
      document.getElementById('deleteBusinessModal')
    );
    modal.show();
  }

  // ✅ Delete business
  deleteBusiness(): void {
    if (!this.deleteBusinessId) return;

    this.api.deleteBusiness(this.deleteBusinessId).subscribe({
      next: () => {
        const modalEl = document.getElementById('deleteBusinessModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();

        this.loadBusiness();
        console.log('Business deleted successfully');
      },
      error: (err) => console.error('Error deleting business:', err),
    });
  }

  add(): void {
    this.selectedBusinessId = null;
    this.BusinesForm.reset();
  }
=======
  business: any[] = [];
  BusinessForm!: FormGroup;
  selectedBusiness: any = null;
  isEditing = false;
  deleteId: string | null = null;
s_id:any;
businessData: any;
superadmin_id: any;
businessList: any[] = [];



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
      pan_image: [''],
      aadhar_image: [''],
      incorporation_certificate: ['']
    });
    this.api.getBusiness().subscribe((res:any)=>{
    console.log(res);
    this.business = res.data;
  })
  }


 loadBusiness() {
  this.api.getBusiness().subscribe({
    next: (res: any) => {
      console.log('Business fetched:', res);
      this.business = res.data || []; 
    },
    error: (err) => console.error('Error loading business:', err)
  });
}



 
  openAddModal() {
    this.isEditing = false;
    this.BusinessForm.reset();
    const modal = new bootstrap.Modal(document.getElementById('editBusinessModal'));
    modal.show();
  }

  openViewModal(b: any) {
    this.selectedBusiness = b;
    const modal = new bootstrap.Modal(document.getElementById('viewModal'));
    modal.show();
  }

  
  editBusiness(b: any) {
console.log(b, 'edit data');
    this.superadmin_id= b._id;
    this.s_id = b._id; 
    console.log(this.superadmin_id);

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
  pan_image: b.pan_image,
  aadhar_image: b.aadhar_image,
  incorporation_certificate: b.incorporation_certificate,

})
 console.log(this.BusinessForm.value);
   const modal = new bootstrap.Modal(document.getElementById('editBusinessModal'));
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
   console.log(this.s_id, this.BusinessForm.value);

  this.api.updateBusiness(this.s_id,this.BusinessForm.value).subscribe((res: any)=>{
    console.log(res, 'Business upadated'); 
     this.loadBusiness(); 
    this.closeModal('editBusinessModal');
  })
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
      error: (err) => console.error('Error deleting business:', err)
    });
  }
}





  
  closeModal(id: string) {
    const modalEl = document.getElementById('deleteBusinessModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
    (document.activeElement as HTMLElement)?.blur();
  }
  
>>>>>>> f75029af8a891d60dfeb82945ffac0b8e2f1bb2d
}

