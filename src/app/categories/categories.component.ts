import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BillingService } from '../billing.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  r: any;
  categoryForm!: FormGroup;
  categories: any;
  business_id: any;
  selectedUserId: string | null = null;
  title = 'Add Category';

  constructor(private api: BillingService, private fb: FormBuilder) {}

  ngOnInit(): void {
    const bid = JSON.parse(localStorage.getItem('bid') || '{}');
    console.log('Stored bid:', bid);
    this.business_id = bid._id;
    console.log(this.business_id, 'business_id');
    this.categoryForm = this.fb.group({
      categories_name:['',Validators.required],
      categories_code:['',Validators.required],
    });
    this.getAllCategories();
  }
  getAllCategories() {
    this.api.getcategories().subscribe({
      next: (res: any) => {
        this.categories = res.data;
        console.log('Categories Loaded:', res.data);
      },
      error: (err) => console.error('Error Loading:', err),
    });
  }
  createOrUpdateRole() {
    if (this.categoryForm.invalid) {
      alert('Please fill all required fields');
      return;
    }
    const formData = new FormData();
    formData.append(
      'categories_name',
      this.categoryForm.get('categories_name')?.value
    );
    formData.append(
      'categories_code',
      this.categoryForm.get('categories_code')?.value
    );
  }
  // if(this.selectedUserId){}

  openAddModal() {
    this.title = 'Add Category';
    this.resetForm();
  }

  edit(cat: any) {
    this.selectedUserId = cat._id;
    this.title = 'Edit Category';
    this.categoryForm.patchValue({
      categories_name: cat.categories_name || cat.categories_name,
      categories_code: cat.categories_code || cat.categories_code,
    });
  }
  delete(id: string) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    this.api.deleteCategory(id).subscribe({
      next: () => {
        alert('User deleted successfully');
        this.getCategory();
      },
      error: (err) => console.error('Delete error', err),
    });
  }
  getCategory() {
    this.api.getcategories().subscribe({
      next: (res: any) => {
        this.categories = Array.isArray(res) ? res : res.data || [];
        console.log('Users list:', this.categories);
      },
      error: (err) => console.error('Get users error:', err),
    });
  }

  resetForm() {
    this.categoryForm.reset();
    this.selectedUserId = null;
  }
}
