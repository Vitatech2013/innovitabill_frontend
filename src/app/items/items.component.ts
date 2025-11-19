import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BillingService } from '../billing.service';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css',
})
export class ItemsComponent implements OnInit {
  addItemsForm!: FormGroup;
  selectedFiles: { [key: string]: File } = {};
  business_id: string = '';
  selectedBusiness: any;
  categories: any[] = [];
  subCategories: any[] = [];
  users: any[] = [];
  allSubCategories: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: BillingService
  ) {}

  ngOnInit(): void {
    this.addItemsForm = this.fb.group({
      item_name: ['', [Validators.required, Validators.minLength(3)]],
      item_code: ['', [Validators.required, Validators.minLength(3)]],
      unit: ['', Validators.required],
      purchase_price: ['', Validators.required],
      selling_price: ['', Validators.required],
      tax_rate: ['', Validators.required],
      stock_quantity: ['', Validators.required],
      description: ['', Validators.required],
      brand_name: ['', Validators.required],
      discount: ['', Validators.required],
      min_stock_alert: ['', Validators.required],
      category_id: ['', Validators.required],
      user_id: ['', Validators.required],
      sub_category_id: ['', Validators.required],
    });

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const bid = JSON.parse(storedUser);
      this.business_id = bid._id || '';
      console.log('Business ID:', this.business_id);
    }

    if (!this.business_id) {
      alert('Business ID missing. Please login again.');
      this.router.navigate(['SuperAdminLogin']);
      return;
    }

    this.categoriesGet();
    this.subCategoriesGet();
    this.usersGet();
  }

  categoriesGet() {
    this.service.getCategories(this.business_id).subscribe({
      next: (res: any) => {
        this.categories = res.data || res;
        console.log('Categories:', this.categories);
      },
      error: (err: any) => console.error('Error loading categories:', err),
    });
  }

  subCategoriesGet() {
    this.service.getSubCategories().subscribe({
      next: (res: any) => {
        this.subCategories = res.data || res;
        console.log('Subcategories:', this.subCategories);
      },
      error: (err: any) => console.error('Error loading subcategories:', err),
    });
  }

  usersGet() {
    this.service.getUsers(this.business_id).subscribe({
      next: (res: any) => {
        console.log('Raw user response:', res);
        this.users = res.data || res;
        console.log('Users:', this.users);
      },
      error: (err: any) => console.error('Error loading users:', err),
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.addItemsForm.get(controlName);
    return control ? control.touched && control.invalid : false;
  }

  cancelAdd() {
    this.addItemsForm.reset();
    this.selectedFiles = {};
  }

  saveBusiness() {
    if (this.addItemsForm.invalid) {
      this.addItemsForm.markAllAsTouched();
      return;
    }

    const f = this.addItemsForm.value;

    const formData = {
      ...f,
      business_id: this.business_id,
      purchase_price: Number(f.purchase_price),
      selling_price: Number(f.selling_price),
      tax_rate: f.tax_rate ? Number(f.tax_rate) : 0,
      stock_quantity: f.stock_quantity ? Number(f.stock_quantity) : 0,
      discount: f.discount ? Number(f.discount) : 0,
      min_stock_alert: f.min_stock_alert ? Number(f.min_stock_alert) : 0,
      sub_category_id: f.sub_category_id || null,
      description: f.description || '',
      brand_name: f.brand_name || '',
    };

    console.log('Sending data:', formData);

    this.service.addItems(formData).subscribe({
      next: (res) => {
        console.log('Item added successfully:', res);

        alert('Item added successfully!');
        this.addItemsForm.reset();
      },
      error: (err) => {
        console.error('Add failed:', err);
        console.log('Backend response:', err.error);
        alert('Check console: ' + err.error.message);
      },
    });
  }

  onCategoryChange(event: Event) {
    const selectedCategoryId = (event.target as HTMLSelectElement).value;
    this.subCategories = this.allSubCategories.filter(
      (sub: any) =>
        sub.category_id?._id === selectedCategoryId ||
        sub.category_id === selectedCategoryId
    );
    this.addItemsForm.patchValue({ category_id: selectedCategoryId });
    console.log('Filtered subcategories:', this.subCategories);
  }
}
