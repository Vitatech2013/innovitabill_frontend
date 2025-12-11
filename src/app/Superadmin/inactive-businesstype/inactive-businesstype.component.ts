import { Component, OnInit } from '@angular/core';
import { BillingService } from '../../Services/billing.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-inactive-businesstype',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './inactive-businesstype.component.html',
  styleUrl: './inactive-businesstype.component.css'
})
export class InactiveBusinesstypeComponent  implements OnInit{
selectedB_type: any;
inactiveBusiness: any[] = [];

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
}
