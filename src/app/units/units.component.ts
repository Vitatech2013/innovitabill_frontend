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
  selector: 'app-units',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css'],
})
export class UnitsComponent implements OnInit {


  UnitForm!: FormGroup;
  units: any[] = [];
  business_id: string = '';
  user_id: string = '';
  selectedId: string | null = null;
  title = 'Add Unit';

  toastMessage: string | null = null;
  toastType: 'success' | 'error' | 'warning' = 'success';
selectedUnit: any;

  constructor(private api: BillingService, private fb: FormBuilder) {}

  ngOnInit(): void {
   
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.business_id = user._id || '';
      this.user_id = user._id || '';
      console.log('Business ID:', this.business_id);
      console.log('User ID:', this.user_id);
    }


    this.UnitForm = this.fb.group({
      units_name: ['', Validators.required],
      unit: ['', Validators.required],
      user_id: [''],
      business_id: [''],
      status:['']
    });


    this.getAllUnits();
  }

 
  getAllUnits() {
    this.api.getUnits().subscribe({
      next: (res: any) => {
        this.units = res.data || res;
        console.log('Units loaded:', this.units);
        // this.showToast('Units loaded successfully', 'success');
      },
      error: (err) => {
        console.error('Error loading units:', err);
        this.showToast('Failed to load units', 'error');
      },
    });
  }

  openAddModal() {
    this.title = 'Add Unit';
    this.selectedId = null;
    this.UnitForm.reset();
    (document.getElementById('UnitModal') as any)?.classList.add('show');
  }


  edit(unit: any) {
    this.selectedId = unit._id;
    this.title = 'Edit Unit';
    this.UnitForm.patchValue({
      units_name: unit.units_name,
      unit: unit.unit,
      status: unit.status || unit.business_status || unit.status?.status || "",

    });
    (document.getElementById('UnitModal') as any)?.classList.add('show');
  }

 
  createOrUpdateUnit() {
    if (this.UnitForm.invalid) {
      this.UnitForm.markAllAsTouched();
      this.showToast('Please fill all required fields', 'warning');
      return;
    }

    this.UnitForm.patchValue({
      user_id: this.user_id,
      business_id: this.business_id,
    });

    if (this.selectedId) {
    
      this.api.updateUnit(this.selectedId, this.UnitForm.value).subscribe({
        next: () => {
          this.showToast('Unit updated successfully', 'success');
          this.getAllUnits();
         const modal = bootstrap.Modal.getInstance(document.getElementById('unitModel'));
        modal.hide();
        },
        error: (err) => {
          console.error('Update error', err);
          this.showToast('Failed to update unit', 'error');
        },
      });
    } else {
      
      this.api.addUnit(this.UnitForm.value).subscribe({
        next: () => {
          this.showToast('Unit added successfully', 'success');
          this.getAllUnits();
          const modal = bootstrap.Modal.getInstance(document.getElementById('unitModel'));
        modal.hide();
        },
        error: (err) => {
          console.error('Create error', err);
          this.showToast('Failed to add unit', 'error');
        },
      });
    }
  }


  // delete(id: string) {
  //   if (!confirm('Are you sure you want to delete this unit?')) {
  //     this.showToast('Delete action cancelled', 'warning');
  //     return;
  //   }

  //   this.api.deleteUnit(id).subscribe({
  //     next: () => {
  //       this.UnitForm.markAllAsTouched()
  //       this.showToast('Unit deleted successfully', 'success');
  //       this.getAllUnits();
  //     },
  //     error: (err) => {
  //       console.error('Delete error', err);
  //       this.showToast('Failed to delete unit', 'error');
  //     },
  //   });
  // }
  openDeleteModal(unit: any) {
this.selectedUnit = unit;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();;
}
confirmDelete() {
if (!this.selectedUnit) return;
    this.api.deleteUnit(this.selectedUnit._id).subscribe({
      next: () => {
        this.showToast('Unit soft deleted successfully', 'success');
        // this.UnitForm.markAllAsTouched()
        
        this.getAllUnits();
         
        const modalEl = document.getElementById('deleteModal');
        if (modalEl) {
          const modal = bootstrap.Modal.getInstance(modalEl);
          modal?.hide();
        }
          this.selectedUnit = null;
      }, 
      
      error: (err) => {
        console.error('Delete error', err);
         this.showToast('Failed to delete unit', 'error');
      },
    });
  }
 
  closeModal() {
    (document.getElementById('UnitModal') as any)?.classList.remove('show');
    this.UnitForm.reset();
    this.selectedId = null;
  }

  showToast(message: string, type: 'success' | 'error' | 'warning') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => (this.toastMessage = null), 3000);
  }
}

