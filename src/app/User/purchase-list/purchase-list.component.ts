import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
declare var bootstrap: any;
import { BillingService } from '../../Services/billing.service';
import { ToastrService } from 'ngx-toastr';
import { constants } from '../../../../constants';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-purchase-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterOutlet],
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.css'],
})
export class PurchaseListComponent implements OnInit {
  items: any[] = [];
  editForm!: FormGroup;
  searchTerm: string = '';
  eid: any;
  selectedPurchases: any;
  business_id: string = '';
  subCategories: any[] = [];
  selectedImage: string | undefined;
  selectedFiles: Record<string, File> = {};
  users: any;
  categories: any[] = [];
  units: any;

  imagePreviewUrl: string = '';
  private baseUrl = constants.baseUrl;

  constructor(
    private service: BillingService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('business');
    if (storedUser) {
      const bid = JSON.parse(storedUser);
      this.business_id = bid._id || '';
      console.log('BusinessID:', this.business_id);
    }
    this.initForm();
    this.loadPurchases();
    this.categoriesGet();
    this.subCategoriesGet();
    this.unitsGet();
  }

  private initForm() {
    this.editForm = this.fb.group({
      purchase_id: [''],
      vendor_id: [''],
      item_id: [''],
      // Vendor details
      vendor_name: ['', [Validators.required, Validators.minLength(3)]],
      vendor_type: ['', Validators.required],
      business_category: ['', Validators.required],
      company_registration_number: [''],

      // Item details
      brand_name: ['', [Validators.required, Validators.minLength(3)]],
      item_name: ['', [Validators.required, Validators.minLength(3)]],
      unit_id: ['', [Validators.required]],
      selling_price: ['', [Validators.required]],
      tax_rate: ['', [Validators.required]],
      stock_quantity: ['', [Validators.required]],
      description: ['', [Validators.required]],
      discount: ['', [Validators.required]],
      status: ['', Validators.required],
      item_code: ['', Validators.required],
      purchase_price: ['', Validators.required],
      category_id: ['', Validators.required],
      sub_category_id: ['', Validators.required],
      min_stock_alert: ['', Validators.required],
      image: [''],
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.editForm.get(controlName);
    return control ? control.touched && control.invalid : false;
  }

  private loadPurchases() {
    this.service.getPurchases(this.business_id).subscribe({
      next: (res: any) => {
        console.log('Purchases fetched:', res);
        // Use populated purchases from backend
        this.items = res?.purchases || [];
      },
      error: (err) => console.error('Error loading Purchases:', err),
    });
  }

  editItem(purchase: any) {
    this.eid = purchase._id;

    // Patch vendor details
    this.editForm.patchValue({
      purchase_id: purchase._id,
      vendor_id: purchase.vendor_id?._id,
      item_id: purchase.item_id?._id,
      vendor_name: purchase.vendor_id?.vendor_name || '',
      vendor_type: purchase.vendor_id?.vendor_type || '',
      business_category: purchase.vendor_id?.business_category || '',
      company_registration_number:
        purchase.vendor_id?.company_registration_number || '',

      // Patch item details
      item_name: purchase.item_id?.item_name || '',
      brand_name: purchase.item_id?.brand_name || '',
      stock_quantity: purchase.item_id?.stock_quantity || '',
      selling_price: purchase.item_id?.selling_price || '',
      status: purchase.status?.toLowerCase() || '',
      item_code: purchase.item_id?.item_code || '',
      unit_id: purchase.item_id?.unit_id?._id || '',
      purchase_price: purchase.purchase_price || '',
      tax_rate: purchase.tax_rate || '',
      description: purchase.item_id?.description || '',
      discount: purchase.item_id?.discount || '',
      min_stock_alert: purchase.item_id?.min_stock_alert || '',
      category_id: purchase.item_id?.category_id?._id || '',
      sub_category_id: purchase.item_id?.sub_category_id?._id || '',
    });

    this.selectedImage = purchase.item_id?.image
      ? purchase.item_id.image.split('/').pop()
      : 'No file chosen';

    const modal = new bootstrap.Modal(document.getElementById('editItemModal'));
    modal.show();
  }

  categoriesGet() {
    this.service.getCategories(this.business_id).subscribe({
      next: (res: any) => {
        this.categories = res.data || res;
      },
      error: (err: any) => console.error('Error loading categories:', err),
    });
  }

  unitsGet() {
    this.service.getUnits(this.business_id).subscribe({
      next: (res: any) => {
        this.units = res.data || res;
      },
      error: (err: any) => console.error('Error loading units:', err),
    });
  }

  subCategoriesGet() {
    this.service.getSubCategories().subscribe({
      next: (res: any) => {
        this.subCategories = res.data || res;
      },
      error: (err: any) => console.error('Error loading subcategories:', err),
    });
  }

  updatePurchase() {
    if (this.editForm.invalid) return;

    const raw = this.editForm.getRawValue();
    const formData = new FormData();

    Object.entries(raw).forEach(([key, value]) => {
      if (value !== null && value !== undefined && key !== 'image') {
        formData.append(key, String(value)); // ✅ FIX
      }
    });

    if (this.selectedFiles?.['image'] instanceof File) {
      formData.append('image', this.selectedFiles['image']); // ✅ File only
    }

    const purchaseId = raw.purchase_id;

    this.service.updatePurchase(purchaseId, formData).subscribe({
      next: () => {
        this.toastr.success('Purchase updated successfully');
        this.loadPurchases();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Update failed');
      },
    });
  }

  isCreatingInvoice(): boolean {
    return this.router.url.includes('/itemlist/items');
  }

  filteredPurchase() {
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
        it.item_id?.item_name?.toLowerCase().includes(term) ||
        it.item_id?.item_code?.toLowerCase().includes(term) ||
        it.item_id?.brand_name?.toLowerCase().includes(term) ||
        it.status?.toLowerCase().includes(term) ||
        it.vendor_id?.vendor_name?.toLowerCase().includes(term)
    );
  }

  onCustomFileSelect(event: any, key: string) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFiles[key] = file;
      this.editForm.patchValue({ [key]: file });
      this.selectedImage = file.name;
    }
  }

  openViewModal(purchase: any) {
    this.selectedPurchases = purchase;
    const itemImage = purchase.item_id?.image;
    this.selectedPurchases.imageUrl = this.getImageUrl(itemImage);

    const modal = new bootstrap.Modal(document.getElementById('ViewModal'));
    modal.show();
  }

  openImageModal(imagePath?: string) {
    if (!imagePath) {
      return;
    }
    this.imagePreviewUrl = imagePath;
    const modalEl = document.getElementById('imagePreviewModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  getImageUrl(path?: string): string {
    if (!path) {
      return 'assets/default-business.jpg';
    }
    const cleanPath = path.replace(/\\/g, '/');
    if (cleanPath.startsWith('http')) {
      return cleanPath;
    }
    if (cleanPath.includes('business_images/')) {
      return `${this.baseUrl}/${cleanPath}`;
    }
    return `${this.baseUrl}/business_images/${cleanPath}`;
  }
}
