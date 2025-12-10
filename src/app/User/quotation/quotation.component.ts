import { Component, OnInit, AfterViewInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


import Modal from 'bootstrap/js/dist/modal';
import { constants } from '../../../../constants';

@Component({
  selector: 'app-quotation',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.css'],
})
export class QuotationComponent implements OnInit, AfterViewInit {
  quotationForm!: FormGroup;
  demoCustomers: any[] = [];
  itemsList: any[] = [];
  grandTotal = 0;
  searchItemTerm: any;
  searchCustomerTerm: any;
  business_id: string = '';
  private pdfDoc: jsPDF | null = null;
  pdfPreviewSrc: string | null = null;
  private pdfPreviewModal: Modal | null = null;
   private baseUrl = constants.baseUrl;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    this.quotationForm = this.fb.group({
      customer: this.fb.group({
        name: ['', [Validators.required]],
        email: [''],
        phone: [''],
      }),
      business: this.fb.group({
        business_id: [''],
        logo_image: [''],
        business_name: [''],
        owner_name: [''],
        email: [''],
        phone_number: [''],
        address: this.fb.group({
          house_No: ['', Validators.required],
          town_Name: ['', Validators.required],
          mandal_Name: ['', Validators.required],
          district_Name: ['', Validators.required],
          state: ['', Validators.required],
          pincode: ['', Validators.required],
        }),
      }),
      items: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.loadBusinessDetails();

    this.getDemoCustomers();
    this.itemsGets();

    const quotationId = this.route.snapshot.paramMap.get('id');
    if (quotationId) {
      this.quotationGet(quotationId);
    }
  }

  ngAfterViewInit() {
    const modalElement = document.getElementById('pdfPreviewModal');
    if (modalElement) {
      this.pdfPreviewModal = new Modal(modalElement, {
        backdrop: 'static',
        keyboard: false,
      });
    }
  }

 loadBusinessDetails() {
  this.http.get<any>(`${this.baseUrl}/business/get`).subscribe({
    next: (b) => {
      if (!b || !b.data || b.data.length === 0) {
        console.warn('No business data found');
        return;
      }

      const business = b.data[0]; // take first business from array

      const businessGroup = this.quotationForm.get('business') as FormGroup;

      let logoUrl = business.logo_image || '';
      if (logoUrl && !logoUrl.startsWith('http')) {
        logoUrl = `${this.baseUrl}/business_images/${logoUrl}`;
      }
      businessGroup.get('logo_image')?.setValue(logoUrl);
      businessGroup.get('business_name')?.setValue(business.business_name || '');
      businessGroup.get('owner_name')?.setValue(business.owner_name || '');
      businessGroup.get('email')?.setValue(business.email || '');
      businessGroup.get('phone_number')?.setValue(business.phone_number || '');

      if (business.address) {
        const addressGroup = businessGroup.get('address') as FormGroup;
        addressGroup.patchValue({
          house_No: business.address.house_No || '',
          town_Name: business.address.town_Name || '',
          mandal_Name: business.address.mandal_Name || '',
          district_Name: business.address.district_Name || '',
          state: business.address.state || '',
          pincode: business.address.pincode || '',
        });
      } else {
        console.warn('Business address missing');
      }
    },
    error: (err) => {
      console.error('Failed to load business details', err);
    },
  });
}


  get items(): FormArray {
    return this.quotationForm.get('items') as FormArray;
  }

  get customerForm(): FormGroup {
    return this.quotationForm.get('customer') as FormGroup;
  }

  createItemGroup(item: any) {
    return this.fb.group({
      item_id: [item._id],
      item_name: [item.item_name],
      selling_price: [item.selling_price],
      tax_rate: [item.tax_rate],
      quantity: [item.quantity || 1],
      total: [item.total || item.selling_price],
    });
  }

  getDemoCustomers() {
    this.http
      .get<any[]>(`${this.baseUrl}/demo/getDemoCustomers`)
      .subscribe({
        next: (res) => {
          this.demoCustomers = res;
        },
        error: (err) => console.error('Demo customers load failed', err),
      });
  }

  itemsGets() {
    this.http
      .get(`${this.baseUrl}/items/get`)
      .subscribe((res: any) => {
        this.itemsList = res.data;
      });
  }

  quotationGet(id: string) {
    this.http
      .get<any>(`${this.baseUrl}/quotation/getQuotation/${id}`)
      .subscribe((res) => {
        this.quotationForm.get('customer')?.patchValue(res.customer);

        const businessGroup = this.quotationForm.get('business') as FormGroup;
        if (businessGroup && res.business) {
          businessGroup
            .get('business_id')
            ?.setValue(res.business.business_id || res.business._id || '');

          let logoUrl = res.business.logo_image || '';
          if (logoUrl && !logoUrl.startsWith('http')) {
            logoUrl = `${this.baseUrl}/uploads/${logoUrl}`;
          }
          businessGroup.get('logo_image')?.setValue(logoUrl);

          if (res.business.address) {
            const addressGroup = businessGroup.get('address') as FormGroup;
            addressGroup.patchValue({
              house_No: res.business.address.house_No || '',
              town_Name: res.business.address.town_Name || '',
              mandal_Name: res.business.address.mandal_Name || '',
              district_Name: res.business.address.district_Name || '',
              state: res.business.address.state || '',
              pincode: res.business.address.pincode || '',
            });
          }
        }

        this.items.clear();
        res.items.forEach((i: any) => this.items.push(this.createItemGroup(i)));
        this.calculateGrandTotal();
      });
  }

  selectCustomer(customer: any) {
    this.quotationForm.get('customer')?.patchValue(customer);
  }

  addItem(item: any) {
    const existing = this.items.controls.find(
      (x) => (x as FormGroup).value.item_id === item._id
    ) as FormGroup | undefined;

    if (existing) {
      const qty = existing.get('quantity')!.value + 1;
      existing.patchValue({ quantity: qty });
      this.recalculateItem(existing);
    } else {
      const group = this.createItemGroup(item);
      this.items.push(group);
    }
    this.calculateGrandTotal();
  }

  recalculateItem(itemGroup: FormGroup) {
    const val = itemGroup.value;
    const total = val.selling_price * val.quantity * (1 + val.tax_rate / 100);
    itemGroup.patchValue({ total });
  }

  calculateGrandTotal() {
    let total = 0;
    this.items.controls.forEach((ctrl: any) => {
      this.recalculateItem(ctrl);
      total += ctrl.value.total;
    });
    this.grandTotal = total;
  }

  removeItem(index: number) {
    this.items.removeAt(index);
    this.calculateGrandTotal();
  }

  saveQuotation() {
    const payload = this.quotationForm.value;
    this.http
      .post(`${this.baseUrl}/quotation/saveQuotation`, payload)
      .subscribe({
        next: (res: any) => {
          alert('Quotation saved successfully!');
          window.location.reload();
        },
        error: (err) => console.error(err),
      });
  }

  filteredCustomers() {
    if (!this.searchCustomerTerm) return this.demoCustomers;
    const term = this.searchCustomerTerm.toLowerCase();
    return this.demoCustomers.filter(
      (c) =>
        c.name?.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term) ||
        c.phone?.toString().includes(term)
    );
  }

  filteredItems() {
    if (!this.searchItemTerm) return this.itemsList;
    const term = this.searchItemTerm.toLowerCase();
    return this.itemsList.filter(
      (i) =>
        i.item_name?.toLowerCase().includes(term) ||
        i.item_code?.toLowerCase().includes(term) ||
        i.selling_price?.toString().includes(term)
    );
  }

  preparePDFPreview() {
    const data = document.getElementById('quotation-content');
    if (!data) return;

    const buttons = data.querySelectorAll('button');
    buttons.forEach((btn) => (btn.style.display = 'none'));

    html2canvas(data, { useCORS: true, allowTaint: false }).then((canvas) => {
      const imgWidth = 208;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const imgData = canvas.toDataURL('image/png');
      this.pdfPreviewSrc = imgData;

      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      this.pdfDoc = pdf;

      buttons.forEach((btn) => (btn.style.display = 'inline-block'));

      this.pdfPreviewModal?.show();
    });
  }

  confirmDownload() {
    if (this.pdfDoc) {
      this.pdfDoc.save('quotation.pdf');
      this.pdfPreviewSrc = null;
      this.pdfPreviewModal?.hide();
    }
  }

  cancelPreview() {
    this.pdfPreviewSrc = null;
    this.pdfPreviewModal?.hide();
  }
}
