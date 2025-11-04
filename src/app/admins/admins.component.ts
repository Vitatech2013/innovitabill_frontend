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

 
}