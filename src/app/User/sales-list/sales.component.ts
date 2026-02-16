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

import { ToastrService } from 'ngx-toastr';
import { BillingService } from '../../Services/billing.service';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './sales.component.html',

  styleUrls: ['./sales.component.css'],
})
export class SalesComponent implements OnInit {
  saledata: any[] = [];
  searchTerm: string = '';
  viewForm!: FormGroup;
  iid: any;
  paymentForm!: FormGroup;
  sid: any;
  toastMessage: string | null = null;
  toastType: string | undefined;
  
  statusFilter: string = '';
selectedFilter: string = 'All';


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: BillingService
  ) {}

  ngOnInit(): void {
    this.viewForm = this.fb.group({
      invoice_number: ['', Validators.required],
      name: ['', Validators.required],
      item_name: ['', Validators.required],
      quantity: ['', Validators.required],
      selling_price: ['', Validators.required],

      grand_total: ['', Validators.required],
      payment_status: ['', Validators.required],
    });

    this.paymentForm = this.fb.group({
      payment_status: ['', Validators.required],
    });

    this.service.saleslist().subscribe((res: any) => {
      console.log('Sales API Response:', res);
      this.saledata = Array.isArray(res.invoices) ? res.invoices : [];
      console.log('Assigned saledata:', this.saledata);
    });
  }

filteredSales() {
  let data = [...this.saledata];

  // ✅ Exact Status Filter
  if (this.statusFilter) {
    data = data.filter(sale =>
      (sale.payment_status || 'pending')
        .toLowerCase()
        .trim() === this.statusFilter
    );
  }

  // ✅ Search Filter
  if (!this.searchTerm) return data;

  const term = this.searchTerm.toLowerCase().trim();

  return data.filter(sale =>
    Object.values(sale).some(val => {
      if (!val) return false;

      if (typeof val === 'object') {
        if ('name' in val && typeof (val as any).name === 'string') {
          return (val as any).name.toLowerCase().includes(term);
        }

        if (Array.isArray(val)) {
          return val.some((p: any) =>
            (p.item_id?.item_name || '')
              .toLowerCase()
              .includes(term)
          );
        }

        return false;
      }

      return val.toString().toLowerCase().includes(term);
    })
  );
}



changeFilter(value: string) {
  this.selectedFilter = value;

  if (value === 'All') {
    this.statusFilter = '';
  } else {
    this.statusFilter = value.toLowerCase();
  }
}



  showActive() {
    this.statusFilter = 'paid';
  }

  showInactive() {
    this.statusFilter = 'partial paid';
  }
  showall() {
    this.statusFilter = 'unpaid';
  }

  view(sale: any) {
    const firstProduct = sale.product_ids?.[0] || {};

    this.viewForm.patchValue({
      invoice_number: sale.invoice_number,
      name: sale.customer_id?.name || '',
      item_name: firstProduct.item_id?.item_name || '',
      quantity: firstProduct.quantity || '',
      selling_price: firstProduct.selling_price || '',

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
  edit(sale: any) {
    console.log('Edit data', sale);
    this.sid = sale._id;
    this.paymentForm.patchValue({
      payment_status: sale.payment_status || 'Pending',
    });
  }
  update() {
    this.service.updatesale(this.sid, this.paymentForm.value).subscribe({
      next: (res: any) => {
        this.toastr.success('Payment Status  Updated successfully!', 'Success');
        window.location.reload();
      },
      error: (err: any) => {
        this.toastr.error('Payment Status Update Failed!', 'Danger');
      },
    });
  }
 
  calculateGrandTotal(sale: any): number {
    if (!sale.product_ids) return 0;

    let total = 0;
    for (const p of sale.product_ids) {
      const qty = p.quantity || 0;
      const price = p.selling_price || 0;
      const discount = p.discount || 0;
      const taxRate = p.tax_rate || 0;

      const baseAmount = qty * price;
      const discountAmount = qty * discount;
      const taxableAmount = baseAmount - discountAmount;
      const taxAmount = (taxableAmount * taxRate) / 100;

      total += taxableAmount + taxAmount;
    }

    return Math.round(total);
  }
}
