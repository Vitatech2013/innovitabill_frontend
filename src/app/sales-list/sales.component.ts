import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { BillingService } from '../billing.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [
    RouterOutlet,
    
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './sales.component.html',

  styleUrls: ['./sales.component.css'],
})
export class SalesComponent implements OnInit {
  saledata: any[] = [];
  searchTerm: string = '';
  editForm!: FormGroup;
  iid: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: BillingService
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      invoice_number: ['', Validators.required],
      name: ['', Validators.required],
      item_id: ['', Validators.required],
      quantity: ['', Validators.required],
      selling_price: ['', Validators.required],
      total: ['', Validators.required],
      grand_total: ['', Validators.required],
      payment_status: ['', Validators.required],
    });

    this.service.saleslist().subscribe((res: any) => {
      console.log('Sales API Response:', res);
      this.saledata = Array.isArray(res.invoices) ? res.invoices : [];
      console.log('Assigned saledata:', this.saledata);
    });
  }

  filteredSales() {
    if (!this.searchTerm) return this.saledata;

    const term = this.searchTerm.toLowerCase();
    return this.saledata.filter((sal) =>
      Object.values(sal).some((val) =>
        val?.toString().toLowerCase().includes(term)
      )
    );
  }

  view(sale: any) {
    const firstProduct = sale.product_ids?.[0] || {};

    this.editForm.patchValue({
      invoice_number: sale.invoice_number,
      name: sale.customer_id?.name || '',
      item_id: firstProduct.item_id?.item_name || '',
      quantity: firstProduct.quantity || '',
      selling_price: firstProduct.selling_price || '',
      total: firstProduct.total || '',
      grand_total: sale.grand_total || '',
      payment_status: sale.payment_status || 'Pending',
    });
  }

  isCreatingInvoice(): boolean {
    return this.router.url.includes('saleslist/sale');
  }

  isInvoiceDetails(): boolean {
    return this.router.url.includes('');
  }
}
