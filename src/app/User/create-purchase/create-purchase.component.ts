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
  styleUrl: './create-purchase.component.css',
})
export class CreatePurchaseComponent implements OnInit {
  addPurchaseForm!: FormGroup;
  selectedImageFile!: File | null;
  selectedFiles: { [key: string]: File } = {};
  business_id: string = '';
  selectedBusiness: any;
  addressFields = [
    { label: 'address_line_1', name: 'address_line_1' },
    { label: 'address_line_2', name: 'address_line_2' },
    { label: ' city', name: 'city' },
    { label: ' state', name: 'state' },
    { label: 'country', name: 'country' },
    { label: 'pincode', name: 'pincode', text: 'number' },
  ];

  constructor(
    private fb: FormBuilder,
    private service: BillingService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    address: this.fb.group({
      address_line_1: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^\S+$/),
        ],
      ],
      address_line_2: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^\S+$/),
          Validators.pattern(/^[A-Za-z ]+$/),
        ],
      ],
      city: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^\S+$/),
          Validators.pattern(/^[A-Za-z ]+$/),
        ],
      ],
      state: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^\S+$/),
          Validators.pattern(/^[A-Za-z ]+$/),
        ],
      ],
      country: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^\S+$/),
          Validators.pattern(/^[A-Za-z ]+$/),
        ],
      ],
      pincode: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[0-9]+$/),
        ],
      ],
    });
  }

  saveItems() {
    if (this.addPurchaseForm.invalid) {
      this.addPurchaseForm.markAllAsTouched();
      return;
    }

    const f = this.addPurchaseForm.value;
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

    if (this.selectedImageFile) {
      formData.append('image', this.selectedImageFile);
    }

    this.service.addItems(formData).subscribe({
      next: (res) => {
        this.toastr.success('Item added successfully!');
        this.addPurchaseForm.reset();
        this.selectedImageFile = null;
        window.location.reload();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Failed to add item', 'Error');
      },
    });
  }
  isInvalid(controlName: string): boolean {
    const control = this.addPurchaseForm.get(controlName);
    return control ? control.touched && control.invalid : false;
  }

  cancelAdd() {
    this.addPurchaseForm.reset();
    this.selectedFiles = {};
  }

  onFileSelect(event: any) {
    this.selectedImageFile = event.target.files[0] || null;
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
