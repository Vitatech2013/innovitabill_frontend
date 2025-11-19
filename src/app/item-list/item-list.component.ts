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
import { BillingService } from '../billing.service';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    RouterOutlet,
  ],
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

  users: any;
  categories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private service: BillingService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
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
  }

  private initForm() {
    this.editForm = this.fb.group({
      brand_name: ['', [Validators.required, Validators.minLength(3)]],
      item_name: ['', [Validators.required, Validators.minLength(3)]],
      unit: ['', [Validators.required]],
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
      user_id: ['', Validators.required],
      min_stock_alert: ['', Validators.required],
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
  // Business_id(Business_id: any) {
  //   throw new Error('Method not implemented.');
  // }

  editItem(it: any) {
    console.log('Edit data', it);
    this.eid = it._id;

    this.editForm.patchValue({
      item_name: it.item_name,
      brand_name: it.brand_name,
      stock_quantity: it.stock_quantity,
      selling_price: it.selling_price,
      status: it.status,
      item_code: it.item_code,
      unit: it.unit,
      purchase_price: it.purchase_price,
      tax_rate: it.tax_rate,
      description: it.description,
      discount: it.discount,
      min_stock_alert: it.min_stock_alert,
    });
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

  updateInvoice() {
    this.service.updateitems(this.eid, this.editForm.value).subscribe({
      next: (res: any) => {
        this.toastr.success('Items updated successfully!', 'Success', {
          positionClass: 'toast-top-center',
        });
      },
      error: (err: any) => {
        this.toastr.error('Failed to update items.', 'Error', {
          positionClass: 'toast-top-center',
        });
        console.error(err);
      },
    });
  }

  deleteItem(it: any) {
    if (confirm(`Are you sure you want to delete ${it.item_name}?`)) {
      this.service.deleteItem(it._id).subscribe({
        next: () => {
          alert(`${it.item_name} deleted successfully.`);
          this.loadItems();
        },
        error: (err: any) => console.error('Delete failed:', err),
      });
    }
  }

  isCreatingInvoice(): boolean {
    return this.router.url.includes('/itemlist/items');
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
  openViewModal(it: any) {
    this.selectedItems = it;
    const modal = new bootstrap.Modal(document.getElementById('ViewModal'));
    modal.show();
  }
  // onCategoryChange(event: Event) {
  //   const selectedCategoryId = (event.target as HTMLSelectElement).value;
  //   this.subCategories = this.allSubCategories.filter(
  //     (sub: any) =>
  //       sub.category_id?._id === selectedCategoryId ||
  //       sub.category_id === selectedCategoryId
  //   );
  //   this.editForm.patchValue({ category_id: selectedCategoryId });
  //   console.log('Filtered subcategories:', this.subCategories);
  // }
}
