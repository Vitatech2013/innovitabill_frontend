import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BillingService } from '../../Services/billing.service';
import { constants } from '../../../../constants';
import { ToastrService } from 'ngx-toastr';

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
  customerForm!: FormGroup;
  showCustomerForm = false;
  business: any = {};
  grandTotal = 0;
  searchTerm = '';
  invoice_number!: string;
  business_id: string = '';
  user_id: string = '';

  currentDate = new Date().toLocaleString();
  baseUrl = constants.baseUrl;

  constructor(
    private fb: FormBuilder,
    private service: BillingService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const storedBusiness = localStorage.getItem('business');
    if (storedBusiness) this.business_id = JSON.parse(storedBusiness)._id;

    const storedUser = localStorage.getItem('users');
    if (storedUser) this.user_id = JSON.parse(storedUser)._id;

    this.customerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: [''],
      address: [''],
    });

    this.getItems();
  }

  getItems() {
    this.service.getItems(this.business_id).subscribe((res: any) => {
      this.items = res.data || [];
    });
  }

  addToCart(item: any) {
    const originalItem = this.items.find((i) => i._id === item._id);

    if (!originalItem || originalItem.stock_quantity <= 0) {
      this.toastr.warning('Out of stock', 'Warning');
      return;
    }

    const cartItem = this.cartItems.find((c) => c._id === item._id);

    if (cartItem) {
      cartItem.cartQty++;
    } else {
      this.cartItems.push({ ...originalItem, cartQty: 1 });
    }

    originalItem.stock_quantity--;

    this.updateTotals();
  }

  removeFromCart(item: any) {
    const cartItem = this.cartItems.find((c) => c._id === item._id);
    const originalItem = this.items.find((i) => i._id === item._id);

    if (!cartItem || !originalItem) return;

    cartItem.cartQty--;
    originalItem.stock_quantity++;

    if (cartItem.cartQty === 0) {
      this.cartItems = this.cartItems.filter((c) => c._id !== item._id);
    }

    this.updateTotals();
  }

  getItemTotal(item: any): number {
    const qty = item.cartQty;
    const price = item.selling_price;
    const discount = item.discount || 0;
    const taxRate = item.tax_rate || 0;

    const baseAmount = qty * price;
    const discountAmount = qty * discount;
    const taxableAmount = baseAmount - discountAmount;
    const taxAmount = (taxableAmount * taxRate) / 100;

    return Math.round(taxableAmount + taxAmount);
  }

  getTotalBill() {
    return this.cartItems.reduce((sum, it) => sum + this.getItemTotal(it), 0);
  }

  updateTotals() {
    this.grandTotal = this.getTotalBill();
  }

  toggleCustomerForm() {
    this.showCustomerForm = !this.showCustomerForm;
  }
  getAvailableStock(itemId: string): number {
    const originalItem = this.items.find((i) => i._id === itemId);
    return originalItem ? originalItem.stock_quantity : 0;
  }

  generateInvoiceNumber() {
    return 'INV-' + Math.floor(Math.random() * 9000);
  }

  generateBill() {
    if (this.cartItems.length === 0) {
      this.toastr.warning('No items in cart!', 'Warning');
      return;
    }

    if (this.customerForm.invalid) {
      this.toastr.warning('Please enter valid details', 'Warning');
      return;
    }

    const customer = this.customerForm.value;
    const invoices: Promise<any>[] = [];

    // Create one invoice per item
    this.cartItems.forEach((item) => {
      const payload = {
        invoice_number: this.generateInvoiceNumber(),
        customer: customer,
        business_id: this.business_id,
        user_id: this.user_id,

        products: [
          {
            item_id: item._id,
            quantity: item.cartQty,
            selling_price: item.selling_price,
            discount: item.discount || 0,
            tax_rate: item.tax_rate || 0,
          },
        ],

        discount: 0,
        payment_status: 'Paid',
      };

      invoices.push(this.service.savesale(payload).toPromise());
    });

    // After saving all invoices → print only ONE bill
    Promise.all(invoices)
      .then(() => {
        this.printBill();
        this.toastr.success('All invoices saved successfully!', 'Success');
        this.resetCart();
      })
      .catch((err) => {
        console.error(err);
        this.toastr.error('Error saving invoices!', 'Error');
      });
  }

  printBill() {
    const content = document.getElementById('printArea')!.innerHTML;
    const printWindow = window.open('', '', 'width=800,height=600');

    if (!printWindow) {
      alert('Popup blocked. Allow pop-ups to print.');
      return;
    }

    printWindow.document.open();
    printWindow.document.write(`
      <html>
      <head>
        <title>Invoice</title>
        <style>
          body { font-family: Arial; margin: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #333; padding: 8px; }
        </style>
      </head>
      <body onload="window.print(); window.close();">
        ${content}
      </body>
      </html>
    `);

    printWindow.document.close();
  }

  resetCart() {
    this.cartItems = [];
    this.showCustomerForm = false;
  }

  filteredItems() {
    let data = [...this.items];

    data.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (!this.searchTerm) {
      return data;
    }

    const term = this.searchTerm.toLowerCase().trim();
    const statuses = ['active', 'inactive', 'pending'];

    if (statuses.includes(term)) {
      return data.filter((it) => it.status?.toLowerCase() === term);
    }

    return data.filter(
      (it) =>
        it.item_name?.toLowerCase().includes(term) ||
        it.item_code?.toLowerCase().includes(term) ||
        it.brand_name?.toLowerCase().includes(term) ||
        it.status?.toLowerCase().includes(term)
    );
  }

  getImageUrl(file: string) {
    return `${this.baseUrl}/business_images/${file}`;
  }

  onPhoneInput(e: any) {
    e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
    this.customerForm.controls['phone'].setValue(e.target.value);
  }
}
