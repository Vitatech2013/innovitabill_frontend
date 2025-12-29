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

  // filteredSales() {
  //   if (!this.searchTerm) return this.saledata;

  //   const term = this.searchTerm.toLowerCase().trim();
  //   const paymentStatuses = ['paid', 'partial paid', 'unpaid', 'pending'];

  //   if (paymentStatuses.includes(term)) {
  //     return this.saledata.filter(
  //       (sale) => (sale.payment_status || 'pending').toLowerCase() === term
  //     );
  //   }

  //   return this.saledata.filter((sale) => {
  //     return Object.values(sale).some((val) => {
  //       if (val === null || val === undefined) return false;

  //       if (typeof val === 'object') {
  //         if (val !== null) {
  //           if ('name' in val && typeof (val as any).name === 'string') {
  //             return (val as any).name.toLowerCase().includes(term);
  //           }
  //            if (sale.invoice_number?.toString().includes(term)) return true;

  //   // 🔹 Customer name
  //   if (sale.customer_id?.name?.toLowerCase().includes(term)) return true;

  //   // 🔹 Payment status
  //   if ((sale.payment_status || 'pending').toLowerCase().includes(term)) return true;

  //   // 🔹 Grand total (number)
  //   if (sale.grand_total?.toString().includes(term)) return true;

  //           if (Array.isArray(val)) {
  //             return val.some((p: any) => {
  //       return (
  //         p.item_id?.item_name?.toLowerCase().includes(term) ||
  //         p.quantity?.toString().includes(term) ||
  //         p.selling_price?.toString().includes(term) ||
  //         p.tax_rate?.toString().includes(term) ||
  //         p.discount?.toString().includes(term)
  //       );
  //           });
  //           }
  //         }
  //         return false;
  //       }

  //       return val.toString().toLowerCase().includes(term);
  //     });
  //   });
  // }
filteredSales() {
  if (!this.searchTerm) {
    return this.saledata;
  }

  const term = this.searchTerm.toString();

  return this.saledata.filter((sale) => {
    const flatString = JSON.stringify({
      invoice: sale.invoice_number,
      customer: sale.customer_id?.name,
      status: sale.payment_status,
      total: sale.grand_total,
      products: sale.product_ids?.map((p: any) => ({
        name: p.item_id?.item_name,
        qty: p.quantity,
        price: p.selling_price,
        tax: p.tax_rate,
        discount: p.discount
      }))
    }).toLowerCase();

    return flatString.includes(term.toLowerCase());
  });
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
  showToast(message: string, type: string) {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => (this.toastMessage = null), 3000);
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
