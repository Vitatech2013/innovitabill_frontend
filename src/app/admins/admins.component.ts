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

admins: any;
adminsFrom!: FormGroup;
adminId: string='';
  deleteAdminId: string='';
 
constructor(private fb:FormBuilder,private api:BillingService,private router:Router){}
ngOnInit(): void {
this.loadAdmins()
this.adminsFrom=this.fb.group({
  full_name:['',Validators.required],
  email:['',Validators.required],
  phone_number:['',Validators.required],
  address:['',Validators.required],
  image:['',Validators.required],
  business_id:['',Validators.required],
  status:[]
});
}
  
loadAdmins() {
this.api.getAdmins().subscribe({
  next:(res:any[])=>{
    this.admins=res||[];
    console.log("Admins Are:",this.admins);
  },
  error:(err:any)=>{
    console.log("error in fetching admins list ",err);
  }
})
}
addAdmins() {
if(this.adminsFrom.invalid)return;
const newAdmins=this.adminsFrom.value;
this.api.addAdmins(newAdmins).subscribe({
  next:(res:any)=>{
    console.log("Admin Added:",res);
    this.loadAdmins();
    this.adminsFrom.reset();
  },
  error:(err:any)=>{
    console.error("error in adding Admin",err);
  }
});
}
openAdminModal(admins:any) {
this.adminId = admins._id;
this.adminsFrom.patchValue({
   full_name:admins.full_name,
  email:admins.email,
 phone_number:admins.phone_number,
 address:admins.address,
  image:admins.image,
  business_id:admins.business_id,
 status:admins.status,
});
const modal = new bootstrap.Modal(document.getElementById('editadminModal'));
modal.show();
}

updateAdmin() {
if(!this.adminsFrom.valid)return;
this.api.updateAdmin(this.adminId,this.adminsFrom.value).subscribe({
  next:()=>{
    const modalEl= document.getElementById('editadminModal');
    const modal= bootstrap.Modal.getInstance(modalEl);
    modal.hide();
    this.getAdmin();
  },
  error:(err:any)=>{
    console.error("error in updating Admins",err);
  },
})
}
  getAdmin() {
this.api.getAdmins().subscribe((res:any)=>{
  this.admins=res;
})
  }
openDeleteModal(id:string) {
 console.log('Deleting Admins ID:', id); 
this.deleteAdminId = id;
const modal = new bootstrap.Modal(document.getElementById('deleteAdminModal'));
modal.show();
}
deleteAdmin() {
 this.api.deleteAdmin(this.deleteAdminId).subscribe({
  next:()=>{
    const modalEl=document.getElementById('deleteBusinessModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
    this.getAdmin();
  },
  error:(err: any)=>{
    console.error(' deleting Admin',err);
  }
});}



}
