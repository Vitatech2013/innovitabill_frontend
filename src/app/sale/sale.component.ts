import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
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
  Business_id: any;
  user_id!: string;
  showCustomerForm = false;
  customerForm!: FormGroup;
  invoice_number!: string;
  searchTerm: any;

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
        console.log('Items fetched:', this.items);
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
    const existingItem = this.cartItems.find(
      (cartItem) => cartItem._id === item._id
    );

    if (item.stock_quantity <= 0) {
      this.toastr.warning('Out of stock!');
      return;
    }

    if (existingItem) {
      existingItem.cartQty++;
    } else {
      this.cartItems.push({ ...item, cartQty: 1 });
    }

    const mainItem = this.items.find((it) => it._id === item._id);
    if (mainItem) {
      mainItem.stock_quantity--;
    }
  }

  removeFromCart(item: any) {
    const existingItem = this.cartItems.find(
      (cartItem) => cartItem._id === item._id
    );

    if (existingItem) {
      existingItem.cartQty--;

      const mainItem = this.items.find((it) => it._id === item._id);
      if (mainItem) {
        mainItem.stock_quantity++;
      }

      if (existingItem.cartQty <= 0) {
        this.cartItems = this.cartItems.filter(
          (cartItem) => cartItem._id !== item._id
        );
      }
    }
  }

   getItemTotal(item: any): number {
    const priceAfterDiscount = item.selling_price - (item.discount || 0);
    const taxAmount = (priceAfterDiscount * (item.tax_rate || 0)) / 100;
    return (priceAfterDiscount + taxAmount) * item.cartQty;
  }

  // Calculate total
  getTotalBill(): number {
    return this.cartItems.reduce((sum, it) => sum + this.getItemTotal(it), 0);
  }

  // Show form for customer details
  toggleCustomerForm() {
    this.showCustomerForm = !this.showCustomerForm;
  }

  // Final bill generation
  generateBill() {
    if (this.cartItems.length === 0) {
      this.toastr.warning('No items in cart to generate bill.');
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
        quantity: it.cartQty,
        selling_price: it.selling_price,
        tax_rate: it.tax_rate,
        discount: it.discount || 0,
      })),
    };

    console.log('Invoice Payload:', payload);

    this.service.savesale(payload).subscribe({
      next: () => {
        this.toastr.success('Bill generated successfully!', 'Success');
        this.cartItems = [];
        this.customerForm.reset();
        this.showCustomerForm = false;
        this.generateInvoiceNumber();
        this.getItems();
      },
      error: (err) => {
        this.toastr.error('Failed to generate bill.', 'Error');
        console.error(err);
      },
    });
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