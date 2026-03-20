import { CommonModule, formatCurrency } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BillingService } from '../../Services/billing.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent implements OnInit {
 searchTerm = '';
 totalItems: number = 0;
totalSales: number = 0;
totalPurchases: number = 0;
totalQuotations: number = 0;
  quotationCount: any;


constructor(private router: Router, private fb: FormBuilder, private service: BillingService){}
 ngOnInit(): void {
   this.getDashboardCounts();
 }
getDashboardCounts() {

  const businessData = localStorage.getItem('business');
  if (!businessData) return;

  const businessId = JSON.parse(businessData)._id;

  this.service.getItem(businessId).subscribe((res:any)=>{
    this.totalItems = res?.length || res?.data?.length || 0;
  });

this.service.getSales(businessId).subscribe((res:any)=>{
  console.log("Sales:", res);
  this.totalSales = res.total || res.invoices?.length || 0;
});

 this.service.getPurchas(businessId).subscribe((res:any)=>{
  console.log("Purchases:", res);
  this.totalPurchases = res.count || res.purchases?.length || 0;
});

this.service.getQuotations(businessId).subscribe((res:any)=>{
   console.log("Quotations:", res);
  this.totalQuotations = res.count || res.quatations?.length || 0;
});

}

}
