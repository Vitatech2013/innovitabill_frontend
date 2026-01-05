import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BillingService } from '../../Services/billing.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-purchase',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-purchase.component.html',
  styleUrls: ['./create-purchase.component.css'],
})
export class CreatePurchaseComponent implements OnInit {
  addPurchaseForm!: FormGroup;
  selectedImage: File | null = null;
  business_id = '';
  user_id = '';
  categories: any[] = [];
  subCategories: any[] = [];
  units: any;

  constructor(
    private fb: FormBuilder,
    private service: BillingService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const business = JSON.parse(localStorage.getItem('business') || '{}');
    const user = JSON.parse(localStorage.getItem('users') || '{}');

    this.business_id = business._id;
    this.user_id = user._id;

    this.addPurchaseForm = this.fb.group({
      vendor_name: ['', Validators.required],
      vendor_type: ['', Validators.required],
      business_category: ['', Validators.required],
      company_registration_number: [''],
      gst_number: [''],
      pan_number: [''],

      address: this.fb.group({
        address_line_1: ['', Validators.required],
        address_line_2: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        country: ['', Validators.required],
        pincode: ['', Validators.required],
      }),

      contact: this.fb.group({
        contact_person_name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        mobile_number: ['', Validators.required],
        alternate_mobile_number: ['', Validators.required],
      }),

      item_name: ['', Validators.required],
      item_code: ['', Validators.required],
      category_id: ['', Validators.required],
      sub_category_id: [''],
      unit_id: ['', Validators.required],
      purchase_price: ['', Validators.required],
      selling_price: ['', Validators.required],
      tax_rate: [''],
      stock_quantity: ['', Validators.required],
      brand_name: [''],
      discount: [''],
      min_stock_alert: [''],
      description: [''],
    });

    this.categoriesGet();
    this.subCategoriesGet();
    this.unitsGet();
  }

  savePurchase() {
    if (this.addPurchaseForm.invalid) {
      return;
    }

    const formData = new FormData();
    const data = this.addPurchaseForm.value;

    Object.keys(data).forEach((key) => {
      if (key === 'address' || key === 'contact') {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    });

    formData.append('business_id', this.business_id);
    formData.append('user_id', this.user_id);

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
      console.log(this.selectedImage);
    }

    this.service.addPurchase(formData).subscribe({
      next: () => {
        this.toastr.success('Purchase added successfully');
        window.location.reload()
        this.router.navigate(['/userdashboard']);
      },  
      error: (err) => {
        this.toastr.error('Error creating purchase', 'Error');
      },
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.addPurchaseForm.get(controlName);
    return !!(control && control.touched && control.invalid);
  }

  cancelAdd() {
    this.addPurchaseForm.reset();
    this.selectedImage = null;
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
    } else {
      this.selectedImage = null;
    }
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
  onInputAlphabetsOnly(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    value = value.replace(/^\s+/, '');

    value = value.replace(/[^A-Za-z ]+/g, '');

    input.value = value;
    this.addPurchaseForm
      .get(input.getAttribute('formControlName')!)
      ?.setValue(value, { emitEvent: false });
  }

  onInputAlphabetsNumbersSpecial(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    value = value.replace(/^\s+/, '');

    value = value.replace(
      /[^A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/? ]+/g,
      ''
    );

    input.value = value;
    this.addPurchaseForm
      .get(input.getAttribute('formControlName')!)
      ?.setValue(value, { emitEvent: false });
  }

  onInputNoSpaces(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    value = value.replace(/\s+/g, '');

    input.value = value;
    this.addPurchaseForm
      .get(input.getAttribute('formControlName')!)
      ?.setValue(value, { emitEvent: false });
  }

  onInputNumbersOnly(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    value = value.replace(/[^0-9.]/g, '');

    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts.shift() + '.' + parts.join('');
    }

    input.value = value;
    this.addPurchaseForm
      .get(input.getAttribute('formControlName')!)
      ?.setValue(value, { emitEvent: false });
  }
  onInputNumbersAndSpecial(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    value = value.replace(/[^0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g, '');

    input.value = value;
    this.addPurchaseForm
      .get(input.getAttribute('formControlName')!)
      ?.setValue(value, { emitEvent: false });
  }
}
