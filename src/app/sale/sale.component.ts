import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { BillingService } from '../billing.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css'],
})
export class SaleComponent implements OnInit {
  items: any[] = [];
  cartItems: any[] = [];
  Business_id!: string;
  user_id!: string;
  showCustomerForm = false;
  customerForm!: FormGroup;
  invoice_number!: string;
  generatedInvoice: any = null;
  business: any = {};
  currentDate = new Date().toLocaleString();
  grandTotal = 0;
  searchTerm: string = '';

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: BillingService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    this.Business_id = userData._id;
    this.user_id = userData._id;
    this.business = {
      name: userData.business_name || 'My Business',
      address: userData.address || 'Main Street, City',
      gst_number: userData.gst_number || 'N/A',
    };

    if (!this.Business_id) {
      alert('Business ID missing. Please login again.');
      this.router.navigate(['SuperAdminLogin']);
      return;
    }

    this.customerForm = this.fb.group({
      name: [''],
      phone: [''],
      email: [''],
      address: [''],
      gst_number: [''],
    });

    this.getItems();
    this.generateInvoiceNumber();
  }

  getItems(): void {
    this.service.getItems(this.Business_id).subscribe({
      next: (res: any) => {
        this.items = res.data || [];
      },
      error: (err: any) => {
        console.error('Error fetching items:', err);
        this.toastr.error('Failed to load items.', 'Error');
      },
    });
  }

  generateInvoiceNumber() {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    this.invoice_number = `INV-${randomNum}`;
  }

  addToCart(item: any) {
    if (item.stock_quantity <= 0) {
      this.toastr.warning('Out of stock!');
      return;
    }

    const existingItem = this.cartItems.find((c) => c._id === item._id);
    if (existingItem) {
      existingItem.cartQty++;
    } else {
      this.cartItems.push({ ...item, cartQty: 1 });
    }

    const mainItem = this.items.find((it) => it._id === item._id);
    if (mainItem) mainItem.stock_quantity--;

    this.updateGrandTotal();
  }

  removeFromCart(item: any) {
    const existingItem = this.cartItems.find((c) => c._id === item._id);
    if (existingItem) {
      existingItem.cartQty--;
      const mainItem = this.items.find((it) => it._id === item._id);
      if (mainItem) mainItem.stock_quantity++;

      if (existingItem.cartQty <= 0) {
        this.cartItems = this.cartItems.filter((c) => c._id !== item._id);
      }
    }
    this.updateGrandTotal();
  }

  getItemTotal(item: any): number {
    const priceAfterDiscount = item.selling_price - (item.discount || 0);
    const taxAmount = (priceAfterDiscount * (item.tax_rate || 0)) / 100;
    return (priceAfterDiscount + taxAmount) * item.cartQty;
  }

  getTotalBill(): number {
    return this.cartItems.reduce((sum, it) => sum + this.getItemTotal(it), 0);
  }

  updateGrandTotal() {
    this.grandTotal = this.getTotalBill();
  }

  toggleCustomerForm() {
    this.showCustomerForm = !this.showCustomerForm;
  }

  generateBill() {
    if (this.cartItems.length === 0) {
      this.toastr.warning('No items in cart to generate bill.', 'Warning');
      return;
    }

    const payload = {
      invoice_number: this.invoice_number,
      customer: this.customerForm.value,
      business_id: this.Business_id,
      user_id: this.user_id,
      discount: this.cartItems.reduce((sum, it) => sum + (it.discount || 0), 0),
      products: this.cartItems.map((it) => ({
        item_id: it._id,
        item_name: it.item_name,
        quantity: it.cartQty,
        selling_price: it.selling_price,
        tax_rate: it.tax_rate,
        discount: it.discount || 0,
      })),
    };

    this.service.savesale(payload).subscribe({
      next: () => {
        this.generatedInvoice = payload;
        this.grandTotal = this.getTotalBill();
        this.showCustomerForm = false;

        this.cdr.detectChanges();

        this.toastr.success('Bill generated successfully!', 'Success');

        setTimeout(() => this.printBill('a4'), 200);
      },
      error: (err) => {
        console.error(err);
        this.toastr.error(
          'Failed to generate bill. Please try again.',
          'Error'
        );
      },
    });
  }

  printBill(type: 'thermal' | 'a4') {
    const content = document.getElementById('printArea')?.innerHTML;

    if (!content) {
      this.toastr.error('Bill content not found.', 'Error');
      return;
    }

    const printWindow = window.open('', '', 'width=350,height=600');

    if (!printWindow) {
      this.toastr.error('Popup blocked! Allow popups to print.', 'Error');
      return;
    }

    const thermalCSS = `
      body {
        font-family: monospace;
        width: 260px;
        margin: 0;
        padding: 0;
        font-size: 12px;
      }
      img { max-width: 80px; }
      hr { border-top: 1px dashed #000; }
  `;

    const a4CSS = `
      body {
        font-family: Arial, sans-serif;
        margin: 40px;
        padding: 0;
        font-size: 14px;
      }
      img { max-height: 80px; }
      hr { border-top: 1px solid #000; }
  `;

    const appliedCSS = type === 'thermal' ? thermalCSS : a4CSS;

    printWindow.document.open();
    printWindow.document.write(`
      <html>
      <head>
          <title>Invoice</title>
          <style>
            ${appliedCSS}
          </style>
      </head>
      <body onload="window.print(); window.close();">
          ${content}
      </body>
      </html>
  `);

    printWindow.document.close();
  }

  filteredItems() {
    if (!this.searchTerm) return this.items;
    const term = this.searchTerm.toLowerCase();
    return this.items.filter((it) =>
      Object.values(it).some((val) =>
        val?.toString().toLowerCase().includes(term)
      )
    );
  }
}
