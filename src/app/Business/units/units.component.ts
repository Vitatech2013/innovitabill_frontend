import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BillingService } from '../../Services/billing.service';

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
  selectedFilter: string = 'Active';
  statusFilter: 'active' | 'inactive' | 'all' = 'active';
  toastMessage: string | null = null;
  toastType: 'success' | 'error' | 'warning' = 'success';
  selectedUnit: any;
  searchTerm: string = '';

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
      units_name: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-z]+( [A-Za-z]+)*$/)],
      ],
      unit_description:['', Validators.required],
      unit: [''],
      user_id: [''],
      business_id: [''],
      status: [''],
    });

    this.getAllUnits();
  }

  getAllUnits() {
    this.api.getUnits(this.business_id).subscribe({
      next: (res: any) => {
        this.units = (res.data || []).sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        console.log('Units loaded:', this.units);
      },
      error: (err) => {
        console.error('Error loading units:', err);
        this.showToast('Failed to load units', 'error');
      },
    });
  }
generateUnitCode(): string {
  const nextNumber = this.units.length + 1;
  return 'UN' + nextNumber.toString().padStart(3, '0');
}


 openAddModal() {
  this.title = 'Add Unit';
  this.selectedId = null;
  this.UnitForm.reset();

  this.UnitForm.patchValue({
    status: 'active'
  });

  const modalEl = document.getElementById('unitModel');
  const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
  modal.show();
}

  edit(unit: any) {
    this.selectedId = unit._id;
    this.title = 'Edit Unit';
    this.UnitForm.patchValue({
      units_name: unit.units_name,
      unit_description: unit.unit_description,
      unit: unit.unit,
      status: unit.status || unit.business_status || unit.status?.status || '',
    });
    const modalEl = document.getElementById('unitModel');
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
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
      console.log(this.UnitForm.value);

    if (this.selectedId) {
      this.api.updateUnit(this.selectedId, this.UnitForm.value).subscribe({
        next: () => {
          this.showToast('Unit updated successfully', 'success');
          this.getAllUnits();
          const modal = bootstrap.Modal.getInstance(
            document.getElementById('unitModel')
          );
          modal.hide();
        },
        error: (err) => {
          console.error('Update error', err);
          this.showToast('Failed to update unit', 'error');
        },
      });
    } else {
        this.UnitForm.patchValue({
      unit: this.generateUnitCode()
    });
      this.api.addUnit(this.UnitForm.value).subscribe({
        next: () => {
          this.showToast('Unit added successfully', 'success');
          this.getAllUnits();
          const modalEl = document.getElementById('unitModel');
          const modal = bootstrap.Modal.getInstance(modalEl);
          modal?.hide();
        },
        error: (err) => {
          console.error('Create error', err);
          this.showToast('Failed to add unit', 'error');
        },
      });
    }
  }
  // filteredUser() {
  //   if (!this.searchTerm) return this.units;
  //   const term = this.searchTerm.toLowerCase();
  //   return this.units.filter((u: any) =>
  //     Object.values(u).some((val) =>
  //       val?.toString().toLowerCase().includes(term)
  //     )
  //   );
  // }
  filteredByStatus() {
    let data = this.units;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      data = data.filter((u: any) =>
        Object.values(u).some((val) =>
          val?.toString().toLowerCase().includes(term)
        )
      );
    }

    if (this.statusFilter === 'all') return data;
    return data.filter((u) => u.status === this.statusFilter);
  }

    changeFilter(value: string) {
    this.selectedFilter = value;

    switch (value) {
      case 'All':
        this.showall();
        break;
      case 'Active':
        this.showActive();
        break;
      case 'Inactive':
        this.showInactive();
        break;
    }
  }
  showActive() {
    this.statusFilter = 'active';
  }

  showInactive() {
    this.statusFilter = 'inactive';
  }
  showall() {
    this.statusFilter = 'all';
  }

  openDeleteModal(unit: any) {
    this.selectedUnit = unit;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
  }
  confirmDelete() {
    if (!this.selectedUnit) return;
    this.api.deleteUnit(this.selectedUnit._id).subscribe({
      next: () => {
        this.showToast('Unit soft deleted successfully', 'success');

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
    const modalEl = document.getElementById('unitModel');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal?.hide();
    this.UnitForm.reset();
    this.selectedId = null;
  }

  showToast(message: string, type: 'success' | 'error' | 'warning') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => (this.toastMessage = null), 3000);
  }
  removeFirstSpace() {
    const c = this.UnitForm.get('units_name');
    if (c?.value?.startsWith(' ')) {
      c.setValue(c.value.trimStart(), { emitEvent: false });
    }
  }


  allowOnlyNumbers(event: KeyboardEvent) {
    const pattern = /^[0-9]$/;
    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
  }
}
