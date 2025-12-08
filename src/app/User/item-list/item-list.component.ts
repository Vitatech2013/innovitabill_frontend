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

import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { BillingService } from '../../Services/billing.service';
import { constants } from '../../../../constants';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterOutlet],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css',
})
export class ItemListComponent implements OnInit {
  items: any[] = [];
  editForm!: FormGroup;
  searchTerm: string = '';
  eid: any;
  selectedItems: any;
  business_id: string = '';
  allSubCategories: any[] = [];
  subCategories: any[] = [];
  selectedImage: string | undefined;
  selectedFiles: Record<string, File> = {};
  users: any;
  categories: any[] = [];
  units: any;
  toastMessage: string | null = null;
  toastType: string | undefined;
  imagefile: any;
  imagePreviewUrl: string = '';
   private baseUrl = constants.baseUrl;

  constructor(
    private fb: FormBuilder,
    private service: BillingService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('business');
    if (storedUser) {
      const bid = JSON.parse(storedUser);
      this.business_id = bid._id || '';
      console.log('BusinessID:', this.business_id);
    }
    this.initForm();
    this.loadItems();
    this.categoriesGet();
    this.subCategoriesGet();
    this.usersGet();
    this.unitsGet();
  }

  private initForm() {
    this.editForm = this.fb.group({
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
      // business_id: ['', Validators.required],
      min_stock_alert: ['', Validators.required],
      image: [''],
    });
  }
  isInvalid(controlName: string): boolean {
    const control = this.editForm.get(controlName);
    return control ? control.touched && control.invalid : false;
  }

  private loadItems() {
    this.service.getItems(this.business_id).subscribe({
      next: (res: any) => {
        console.log('Items fetched:', res);
        this.items = res?.data || [];
      },
      error: (err) => console.error('Error loading items:', err),
    });
  }

  editItem(it: any) {
    console.log('Edit data', it);
    this.eid = it._id;

    this.editForm.patchValue({
      item_name: it.item_name,
      brand_name: it.brand_name,
      stock_quantity: it.stock_quantity,
      selling_price: it.selling_price,
      status: it.status?.toLowerCase(),
      item_code: it.item_code,
      unit_id: it.unit_id?._id,
      purchase_price: it.purchase_price,
      tax_rate: it.tax_rate,
      description: it.description,
      discount: it.discount,
      min_stock_alert: it.min_stock_alert,
      category_id: it.category_id?._id,
      sub_category_id: it.sub_category_id?._id,
    });
    this.selectedImage = it.image
      ? it.image.split('/').pop()
      : 'No file chosen';

    console.log('Editing item:', it);
    const modal = new bootstrap.Modal(document.getElementById('editItemModal'));
    modal.show();
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
        console.log('Raw users response', res);
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

  updateItems() {
    const formData = new FormData();

    Object.keys(this.editForm.value).forEach((key) => {
      if (key !== 'image') {
        formData.append(key, this.editForm.value[key]);
      }
    });

    if (this.selectedFiles['image']) {
      formData.append('image', this.selectedFiles['image']);
    }

    this.service.updateitems(this.eid, formData).subscribe({
      next: (res: any) => {
        this.toastr.success('Item Updated Successfully');
        this.loadItems();
        window.location.reload();
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('Update Failed');
      },
    });
  }
  deleteItem(it: any) {
    if (confirm(`Are you sure you want to delete ${it.item_name}?`)) {
      this.service.deleteItem(it._id).subscribe({
        next: () => {
          this.showToast(
            `${it.item_name} deleted successfully.`,
            `Successfully`
          );
          this.loadItems();
          window.location.reload();
        },
        error: (err: any) => console.error('Delete failed:', err),
      });
    }
  }

  isCreatingInvoice(): boolean {
    return this.router.url.includes('/itemlist/items');
  }

  filteredItems() {
    if (!this.searchTerm) {
      return [...this.items].sort((a, b) =>
        JSON.stringify(a).localeCompare(JSON.stringify(b))
      );
    }

    const term = this.searchTerm.toLowerCase();

    return this.items
      .filter((it) =>
        Object.values(it).some((val) =>
          val?.toString().toLowerCase().includes(term)
        )
      )
      .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  }
  onCustomFileSelect(event: any, key: string) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFiles[key] = file;
      this.editForm.patchValue({ [key]: file });
      this.selectedImage = file.name;
    }
  }
  openViewModal(it: any) {
    this.selectedItems = it;
    this.selectedItems.imageUrl = this.getImageUrl(it.image); // <-- FIX
    const modal = new bootstrap.Modal(document.getElementById('ViewModal'));
    modal.show();
  }
  showToast(message: string, type: string) {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => (this.toastMessage = null), 3000);
  }
  openImageModal(imagePath: string | undefined) {
    this.imagePreviewUrl = this.getImageUrl(imagePath || '');
    const modal = new bootstrap.Modal(
      document.getElementById('imagePreviewModal')
    );
    modal.show();
  }
  getImageUrl(path: string): string {
    if (!path) return 'assets/default-business.jpg';
    const cleanPath = path.replace(/\\/g, '/');
    return cleanPath.includes('business_images/')
      ? `${this.baseUrl}/${cleanPath}`
      : `${this.baseUrl}/business_images/${cleanPath}`;
  }
}
