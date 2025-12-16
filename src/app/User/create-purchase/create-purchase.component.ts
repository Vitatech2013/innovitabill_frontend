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
    { label: 'Address Line 1', name: 'address_line_1' },
    { label: 'Address Line 2', name: 'address_line_2' },
    { label: 'City', name: 'city' },
    { label: 'Country', name: 'country' },
    { label: 'State', name: 'state' },
    { label: 'Pincode', name: 'pincode' },
  ];

  constructor(
    private fb: FormBuilder,
    private service: BillingService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.addPurchaseForm = this.fb.group({
      item_name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[a-zA-Z0-9]+$'),
        ],
      ],
      item_code: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[a-zA-Z0-9]+$'),
        ],
      ],
      purchased_price: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9!@#$%^&*()_+\\-=[\\]{};\'":\\\\|,.<>/?]+$'),
        ],
      ],
      tax_rate: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9!@#$%^&*()_+\\-=[\\]{};\'":\\\\|,.<>/?]+$'),
        ],
      ],
      stock_quantity: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9!@#$%^&*()_+\\-=[\\]{};\'":\\\\|,.<>/?]+$'),
        ],
      ],
      brand_name: [
        '',
        [Validators.required, Validators.pattern('^[A-Za-z]+$')],
      ],
      units: ['', Validators.required],
      image: [''],
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
        country: [
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
        pincode: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern(/^[0-9]+$/),
          ],
        ],
      }),
      contact: this.fb.group({
        contact_person_name: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern('^[a-zA-Z0-9]+$'),
          ],
        ],
        email: [
          '',
          [Validators.required, Validators.email, Validators.pattern(/^\S+$/)],
        ],
        mobile_number: [
          '',
          [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
        ],
        alternate_mobile_number: [
          '',
          [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
        ],
      }),
      vendor_name: ['', Validators.required],
      vendor_id: ['', Validators.required],
      vendor_type: ['', Validators.required],
      business_category: ['', Validators.required],
      company_registration_number: ['', Validators.required],
      gst_number: ['', Validators.required],
      pan_number: ['', Validators.required],
    });

    const storedBusiness = localStorage.getItem('business');
    if (storedBusiness) {
      const b = JSON.parse(storedBusiness);
      this.business_id = b._id;
      console.log('Business ID:', this.business_id);
    }
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
    formData.append('purchased_price', f.purchase_price);
    formData.append('vendor_name', f.vendor_name);
    formData.append('tax_rate', f.tax_rate);
    formData.append('stock_quantity', f.stock_quantity);
    formData.append('vendor_id', f.vendor_id);
    formData.append('vendor_type', f.vendor_type);
    formData.append('business_category', f.business_category);
    formData.append('brand_name', f.brand_name);
    formData.append('gst_number', f.gst_number);
    formData.append('pan_number', f.pan_number);
    formData.append('units', f.units);

    formData.append('business_id', this.business_id);

    if (this.selectedImageFile) {
      formData.append('image', this.selectedImageFile);
    }
    Object.keys(this.addPurchaseForm.controls).forEach((key) => {
      const control = this.addPurchaseForm.get(key);

      if (key === 'address') {
        const addr = control?.value;
        formData.append('address', JSON.stringify(addr));
      } else {
        if (control?.value && typeof control.value === 'string') {
          formData.append(key, control.value);
        }
      }
    });

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
