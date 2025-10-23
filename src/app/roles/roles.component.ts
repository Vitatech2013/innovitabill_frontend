import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BillingService } from '../billing.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent  implements OnInit{

  Roles: any;

constructor(private api:BillingService){}

  ngOnInit(): void {
    this.loadRoles()
  }
  loadRoles() {
this.api.getRoles().subscribe({
  next:(res:any[])=>{
    this.Roles=res||[];
    console.log("Roles list:",this.Roles);
  },
  error:(err:any)=>{
    console.error("Error fetching roles list:",err);
  }
})
  }

}
