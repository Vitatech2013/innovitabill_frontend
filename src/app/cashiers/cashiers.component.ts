import { Component, OnInit } from '@angular/core';
import { BillingService } from '../billing.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-cashiers',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './cashiers.component.html',
  styleUrl: './cashiers.component.css'
})
export class CashiersComponent  implements OnInit{
  cashiers: any;
  constructor(private api:BillingService){}

  ngOnInit(): void {
    this.loadcashiers()
  }
  loadcashiers() {
    this.api.getCashiers().subscribe({
      next:(res:any[])=>{
        this.cashiers=res||[];
        console.log("Cashires list:",this.cashiers);
      },
      error:(err:any)=>{
        console.error("Error fetching Cashiers list:",err);
      }
    })
  }

}
