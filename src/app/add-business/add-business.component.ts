import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BillingService } from '../billing.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-business',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,FormsModule],
  templateUrl: './add-business.component.html',
  styleUrl: './add-business.component.css'
})
export class AddBusinessComponent  implements OnInit{
addFormVisible = false;
addBusinesForm!:FormGroup;

constructor(private api:BillingService, private fb:FormBuilder, private router:Router){}
  ngOnInit(): void {
     this.addBusinesForm= this.fb.group({
       business_name:['',Validators.required],
        owner_name:['',Validators.required],
        phone_number:['',Validators.required],
        business_type:['',Validators.required],
        business_address:['',Validators.required],
        registration_number:['',Validators.required],
        gst_number:['',Validators.required],
        logo_image:['',Validators.required],
        pan_image:['',Validators.required],
        aadhar_image:['',Validators.required],
        incorporation_certificate:['',Validators.required],
     }) 
    }
    
toggleAddForm() {
  this.addFormVisible = !this.addFormVisible;
}
cancelAdd() {
  this.addFormVisible = false;
  this.addBusinesForm.reset();
}


addbusiness() {
  if (this.addBusinesForm.invalid) return;

  const newBusiness = this.addBusinesForm.value;
  this.api.addBusiness(newBusiness).subscribe({
    next: (res: any) => {
      console.log('Business added:', res);
      this.addFormVisible = false;
      this.addBusinesForm.reset();
      this.addFormVisible = false; 
    },
    error: (err: any) => {
      console.error('Error adding business', err);
    },
  });
}



}
