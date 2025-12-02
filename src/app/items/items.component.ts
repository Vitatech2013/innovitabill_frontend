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
import { ToastrService } from 'ngx-toastr';

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
  units: any;
  users_id: string = '';
  toastType: any;
  toastMessage: any;
  selectedImageFile!: File | null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: BillingService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.addItemsForm = this.fb.group({
      item_name: ['', [Validators.required, Validators.minLength(3)]],
      item_code: ['', [Validators.required, Validators.minLength(3)]],
      unit_id: ['', [Validators.required]],
      purchase_price: ['', Validators.required],
      selling_price: ['', Validators.required],
      tax_rate: ['', Validators.required],
      stock_quantity: ['', Validators.required],
      description: ['', Validators.required],
      brand_name: ['', Validators.required],
      discount: ['', Validators.required],
      min_stock_alert: ['', Validators.required],
      category_id: ['', Validators.required],
      sub_category_id: ['', Validators.required],
      image: [''],
    });

    const storedBusiness = localStorage.getItem('business');
    if (storedBusiness) {
      const b = JSON.parse(storedBusiness);
      this.business_id = b._id;
      console.log('Business ID:', this.business_id);
    }

    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const u = JSON.parse(storedUsers);
      this.users_id = u._id || '';
      console.log('User ID:', this.users_id);
    }

    this.categoriesGet();
    this.subCategoriesGet();

    this.unitsGet();
  }

  showToast(message: string, type: 'success' | 'error' | 'warning') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => (this.toastMessage = null), 3000);
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

  unitsGet() {
    this.service.getUnits(this.business_id).subscribe({
      next: (res: any) => {
        console.log('Raw units response', res);
        this.units = res.data || res;
        console.log('Units:', this.units);
      },
      error: (err: any) => console.error('Error loading units:', err),
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

  isInvalid(controlName: string): boolean {
    const control = this.addItemsForm.get(controlName);
    return control ? control.touched && control.invalid : false;
  }

  cancelAdd() {
    this.addItemsForm.reset();
    this.selectedFiles = {};
  }

  saveItems() {
    if (this.addItemsForm.invalid) {
      this.addItemsForm.markAllAsTouched();
      return;
    }

    const f = this.addItemsForm.value;
    const formData = new FormData();

    formData.append('item_name', f.item_name);
    formData.append('item_code', f.item_code);
    formData.append('purchase_price', f.purchase_price);
    formData.append('selling_price', f.selling_price);
    formData.append('tax_rate', f.tax_rate);
    formData.append('stock_quantity', f.stock_quantity);
    formData.append('discount', f.discount);
    formData.append('min_stock_alert', f.min_stock_alert);
    formData.append('description', f.description);
    formData.append('brand_name', f.brand_name);
    formData.append('category_id', f.category_id);
    formData.append('sub_category_id', f.sub_category_id);
    formData.append('unit_id', f.unit_id);

    formData.append('business_id', this.business_id);
    formData.append('user_id', this.users_id);

    if (this.selectedImageFile) {
      formData.append('image', this.selectedImageFile);
    }

    this.service.addItems(formData).subscribe({
      next: (res) => {
        this.toastr.success('Item added successfully!');
        this.addItemsForm.reset();
        this.selectedImageFile = null;
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Failed to add item', 'Error');
      },
    });
  }

  onFileSelect(event: any) {
    this.selectedImageFile = event.target.files[0] || null;
  }
}
