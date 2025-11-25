import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BillingService } from '../billing.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-business-type',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './add-business-type.component.html',
  styleUrl: './add-business-type.component.css'
})
export class AddBusinessTypeComponent implements OnInit {

  selectedBusiness: any;
  addBusinessTypeForm!: any;
  superadmin_id: any;

  constructor(
    private api: BillingService, 
    private fb: FormBuilder, 
    private router: Router, 
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const saData = JSON.parse(localStorage.getItem('sa') || '{}');
    this.superadmin_id = saData._id;

    if (!this.superadmin_id) {
      alert('Superadmin ID missing. Please login again.');
      this.router.navigate(['SuperAdminLogin']);
    }

    this.addBusinessTypeForm = this.fb.group({
      business_type: ['', [Validators.required, Validators.minLength(3)]],
      business_code: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  saveBusiness() {
    if (this.addBusinessTypeForm.invalid) {
      this.addBusinessTypeForm.markAllAsTouched();
      return;
    }

    const formData = {
      business_type: this.addBusinessTypeForm.value.business_type,
      business_code: this.addBusinessTypeForm.value.business_code,
      superadmin_id: this.superadmin_id
    };

    if (this.selectedBusiness && this.selectedBusiness._id) {

      this.api.updateBusinessType(this.selectedBusiness._id, formData).subscribe({
        next: (res: any) => {
          this.toastr.success('Business Type Updated Successfully!');
          this.addBusinessTypeForm.reset();
          this.selectedBusiness = null;
        },
        error: (err: any) => {
          console.error(err);
          alert('Failed to update business type.');
        }
      });

      return;
    }

    this.api.addBusinessType(formData).subscribe({
      next: (res: any) => {
        this.toastr.success('Business Type added successfully!');
        this.addBusinessTypeForm.reset();
        
      },
      error: (err: any) => {
        console.error(err);
        alert('Failed to add business type.');
      }
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.addBusinessTypeForm.get(controlName);
    return control ? control.touched && control.invalid : false;
  }
}
