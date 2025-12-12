import { Component, OnInit } from '@angular/core';
import { BillingService } from '../../Services/billing.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-inactive-businesstype',
  standalone: true,
  imports: [CommonModule,RouterLink,ReactiveFormsModule,FormsModule],
  templateUrl: './inactive-businesstype.component.html',
  styleUrl: './inactive-businesstype.component.css'
})
export class InactiveBusinesstypeComponent  implements OnInit{
selectedB_type: any;
inactiveBusiness: any[] = [];
 searchTerm: string = '';
  constructor(private inactiveApi:BillingService) {}

  ngOnInit(): void {
    this.getInactiveBusiness();
  }
 getInactiveBusiness() {
    this.inactiveApi.getAllBusinessTypes().subscribe({
      next: (res: any) => {
       
        this.inactiveBusiness = res.data.filter((b: { status: string; }) => b.status === 'inactive');
      },
      error: (err: any) => console.error('Fetch error', err)
    });
  }
   DeleteModal(b_type: any) {
    this.selectedB_type = b_type;
    const modalEl = document.getElementById('deleteModal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
  filteredBusiness() {
    if (!this.searchTerm) return this.inactiveBusiness;
    const term = this.searchTerm.toLowerCase();
    return this.inactiveBusiness.filter((b) =>
      Object.values(b).some((val) =>
        val?.toString().toLowerCase().includes(term)
      )
    );
  }
}
