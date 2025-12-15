import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { AddBusinessTypeComponent } from "../add-business-type/add-business-type.component";
import { BillingService } from '../../Services/billing.service';
import { RouterLink } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-view-business-type',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, AddBusinessTypeComponent],
  templateUrl: './view-business-type.component.html',
  styleUrls: ['./view-business-type.component.css']
})
export class ViewBusinessTypeComponent implements OnInit {
  selectedTypeId: string | null = null;
  toastMessage: string | null = null;
  toastType: 'success' | 'error' | 'warning' | null = null;
  b_typeForm!: FormGroup;
  openModal = false;
  b_types: any[] = [];
  title: string = '';
  selectedB_type: any;
   searchTerm: string = '';
   inactiveCount: number = 0;
  
filterMode: 'active' | 'inactive' = 'active';


  

  constructor(private fb: FormBuilder, private api: BillingService) {}

  ngOnInit(): void {
    this.b_typeForm = this.fb.group({
      business_type: ['', [Validators.required, Validators.minLength(3)]],
      business_code: ['', [Validators.required, Validators.minLength(3)]],
      status: ['', Validators.required]
    });
    this.getAllBusinessTypes();
  }

 getAllBusinessTypes() {
  this.api.getAllBusinessTypes().subscribe({
    next: (res: any) => {
      this.b_types = res.data; 
      this.inactiveCount = res.data.filter((b: any) => b.status === 'inactive').length;
    },
    error: (err) => console.error('Fetch error', err)
  });
}


  openAddModal() {
    this.title = 'Add Business Type';
    this.resetForm();
    this.openModal = true;
  }

// filteredBusiness() {
//     if (!this.searchTerm) return this.b_types;
//     const term = this.searchTerm.toLowerCase();
//     return this.b_types.filter((b) =>
//       Object.values(b).some((val) =>
//         val?.toString().toLowerCase().includes(term)
//       )
//     );
//   }

  edit(b_type: any) {
    this.title = 'Edit Business Type';
    this.selectedTypeId = b_type._id;
    this.b_typeForm.patchValue({
      business_type: b_type.business_type,   
    business_code: b_type.business_code,
    status: b_type.status 
    });
    this.openModal = true;
  }

 Updatebtype() {
    if (this.b_typeForm.invalid) return;

    const data = this.b_typeForm.value;

    if (this.selectedTypeId) {
    
      this.api.updateBusinessType(this.selectedTypeId, data).subscribe({
        next: () => {
          this.showToast('Business Type updated successfully', 'success');
          this.getAllBusinessTypes();

          const modal = bootstrap.Modal.getInstance(document.getElementById('roleModal'));
          modal?.hide();
        },
        error: () => this.showToast('Failed to update business type', 'error')
      });

    } else {
     
      this.api.addBusinessType(data).subscribe({
        next: () => {
          this.showToast('Business Type added', 'success');
          this.getAllBusinessTypes();

          const modal = bootstrap.Modal.getInstance(document.getElementById('roleModal'));
          modal?.hide();
        },
        error: () => this.showToast('Failed to add business type', 'error')
      });
    }
  }

  DeleteModal(b_type: any) {
    this.selectedB_type = b_type;
    const modalEl = document.getElementById('deleteModal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }

  confirmDelete() {
    if (!this.selectedB_type) return;

    this.api.deleteBusinessType(this.selectedB_type._id).subscribe({
      next: () => {
        this.showToast('Business Type deleted successfully', 'success');
        this.getAllBusinessTypes();
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        modal?.hide();
      },
      error: (err) => {
        console.error('Delete error', err);
        this.showToast('Failed to delete business type', 'error');
      }
    });
  }

  closeModal() {
    this.openModal = false;
    this.resetForm();
  }

  resetForm() {
    this.b_typeForm.reset();
    this.selectedTypeId = null;
  }

  showToast(message: string, type: 'success' | 'error' | 'warning') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => (this.toastMessage = null), 3000);
  }


filteredBusiness() {
  let list = this.b_types.filter(b => {
    const status = b.status?.toLowerCase().trim();
    return this.filterMode === 'active'
      ? status === 'active'
      : status === 'inactive';
  });

  if (this.searchTerm?.trim()) {
    const term = this.searchTerm.toLowerCase();
    list = list.filter((b) =>
      Object.values(b).some((val) =>
        val?.toString().toLowerCase().includes(term)
      )
    );
  }

  return list;
}




showActive() {
  this.filterMode = 'active';
}

showInactive() {
  this.filterMode = 'inactive';
}
}
