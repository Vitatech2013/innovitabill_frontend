import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BillingService } from '../billing.service';

@Component({
  selector: 'app-managers',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './managers.component.html',
  styleUrl: './managers.component.css'
})
export class ManagersComponent implements OnInit {
manager: any;
 
constructor(private api:BillingService){}
  ngOnInit(): void {
    this.loadManager()
  }
  loadManager() {
this.api.getManager().subscribe({
      next:(res:any[])=>{
        this.manager=res||[];
        console.log("manager lists:",this.manager);
      },
      error:(err:any)=>{
        console.error("Error fetching manager list:",err);
      }
    })
  }

}
