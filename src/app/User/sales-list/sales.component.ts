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
  editForm!: FormGroup;
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
    this.editForm = this.fb.group({
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
        this.showToast('Payment Status  Updated successfully!', 'Success');
        window.location.reload();
      },
      error: (err: any) => {
        this.showToast('Payment Status Update Failed!', 'Danger');
      },
    });
  }
  showToast(message: string, type: string) {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => (this.toastMessage = null), 3000);
  }
}
