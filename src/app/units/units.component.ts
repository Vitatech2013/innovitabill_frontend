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

@Component({
  selector: 'app-units',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './units.component.html',
  styleUrl: './units.component.css',
})
export class UnitsComponent implements OnInit {

  units: any;
  business_id: any;
  selectedId: any;
  UnitForm!: FormGroup;
  title: any;
openModal: boolean = false;
  

  constructor(private api: BillingService, private fb: FormBuilder) {}
  ngOnInit(): void {
        const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const bid = JSON.parse(storedUser);
      this.business_id = bid._id || '';
      console.log('Business ID:', this.business_id);
    }
    this.UnitForm= this.fb.group({
      units_name:['',Validators.required],
      unit:['',Validators.required],
    });
    this.getAllUnits();
   
  }
  getAllUnits() {
    this.api.getUnits(this.UnitForm.value).subscribe((res: any)=>{
      console.log(res,'succes')
    })
  }
  createOrUpdateUnit() {
    if(this.UnitForm.invalid){
      alert('Fill correctly');
      return;

    }
    const formData = new FormData();
    formData.append('units_name', this.UnitForm.get('units_name')?.value);
    formData.append('unit', this.UnitForm.get('unit')?.value);
    formData.append('user_id', this.UnitForm.get('user_id')?.value);
    formData.append('business_id', this.UnitForm.get('business_id')?.value);

    if(this.selectedId) {
      this.api.updateUnit(this.selectedId,formData).subscribe({
        next:()=>{
          alert('User updated successfully');
          this.getAllUnits();
          this.resetForm();
        },
        error: (err) => console.error('Update error', err),
      });
    }
      else{
        this.api.addUnit(formData).subscribe({
          next:()=>{
            alert('User added successfully');
            this.getAllUnits();
            this.resetForm();
          },
           error: (err) => console.error('Create error', err),
        })
      }
    
  }
  edit(unit: any) {
    this.selectedId = unit._id;
    this.title= 'Edit Unit';
    this.UnitForm.patchValue({
      units_name: unit.units_name || unit.units_name,
      unit: unit.unit || unit.unit,
      user_id: unit.user_id || unit.user_id,
      business_id: unit.business_id|| unit.business_id
    })
  }
  delete(id: string) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    this.api.deleteUnit(id).subscribe({
      next: () => {
        alert('User deleted successfully');
        this.getAllUnits();
      },
      error: (err) => console.error('Delete error', err),
    });
  }
  

  openAddModal() {
    this.title = 'Add Unit';
    this.resetForm();
    this.openModal = true;
  }
  resetForm() {
    this.UnitForm.reset();
    this.selectedId = null;
  }
}
