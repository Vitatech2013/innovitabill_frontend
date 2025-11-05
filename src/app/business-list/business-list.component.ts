import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BillingService } from '../billing.service';
import { AddBusinessComponent } from '../add-business/add-business.component';
import { RouterLink } from "@angular/router";

declare var bootstrap: any;

@Component({
  selector: 'app-business-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './business-list.component.html',
  styleUrl: './business-list.component.css'
})
export class BusinessListComponent implements OnInit {
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
  
}

