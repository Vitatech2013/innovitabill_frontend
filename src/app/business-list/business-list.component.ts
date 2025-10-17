import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router,  RouterOutlet } from '@angular/router';
import { BillingService } from '../billing.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-business-list',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './business-list.component.html',
  styleUrl: './business-list.component.css'
})
export class BusinessListComponent  implements OnInit{



toastMessage:string | null=null;
business: any;
BusinesForm!: FormGroup;
  businessid: any;
 

constructor(private api:BillingService,private fb:FormBuilder,private router:Router){}

  ngOnInit() {
    this.loadBusiness()
this.BusinesForm=this.fb.group({
  business_name:['',Validators.required],
  owner_name:['',Validators.required],
  phone_number:['',Validators.required],
  business_type:['',Validators.required]
})


this.toastMessage=history.state?.toast  || null;
     if (this.toastMessage) {
      
      setTimeout(() => this.toastMessage = null, 3000);
    }

  }
  loadBusiness() {
    this.api.getBusiness().subscribe({
      next:(res:any[])=>{
        this.business=res||[];
        console.log("business lists:",this.business);
      },
      error:(err:any)=>{
        console.error("Error fetching business list:",err);
      }
    })
  }
 addbusiness() {
  if(this.BusinesForm.invalid)return;
  const newBusiness=this.BusinesForm.value;
  this.api.addBusiness(newBusiness).subscribe({
    next:(res: any)=>{
      console.log('business added:',res);
      this.loadBusiness();
      this.BusinesForm.reset();
    },
    error:(err: any)=>{
      console.error('Error in Adding business',err);
    }
  });
}
updateBusiness() {

}

openBusinessModal(business:any) {
this.businessid=business._id;
this.BusinesForm.patchValue({
  business_name:business.name,
  owner_name:business.number,
 phone_number:business.email
});
const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
modal.show();
}

}
