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
  
  categoryForm!: FormGroup;
  categories: any[] = [];
  business_id: any;

  title = 'Add Category';
  selectedCategoryId: any;
  selectedUserId: string | null = null;
cat: any;
  
openModal: boolean = false;
r: any;

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
        this.categories = Array.isArray(res) ? res : res.data || [];
        console.log('Categories Loaded:', res.categories);
      },
      error: (err) => console.error('Error Loading:', err),
    });
  }

    openAddModal() {
    this.title = 'Add Category';
   this.openModal = true;
    this.resetForm();
  }


    edit(cat: any): void {
    this.selectedUserId = cat._id;
    this.title = 'Edit Category';
    this.categoryForm.patchValue({
      categories_name: cat.categories_name || cat.categories_name,
      categories_code: cat.categories_code || cat.categories_code,
      // user_id: cat.user_id|| cat.user_id,
      // business_id: cat.business_id || cat.business_id,
    });
    this.openModal= true;
  }

  delete(id: string) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    this.api.deleteCategory(id).subscribe({
      next: () => {
        alert('User deleted successfully');
        this.getAllCategories();
      },
      error: (err) => console.error('Delete error', err),
    });
  }

 createOrUpdateCategory(): void {
  if (this.categoryForm.invalid) {
      alert('Please fill all required fields correctly');
      return;
    }

  const formData = new FormData();
  formData.append('category_name', this.categoryForm.get('category_name')?.value);
  formData.append('categories_code', this.categoryForm.get('categories_code')?.value);
  formData.append('user_id', this.categoryForm.get('user_id')?.value);
  formData.append('business_id', this.categoryForm.get('business_id')?.value);

  if (this.selectedCategoryId) {
  
    this.api.updateCategory(this.selectedCategoryId, formData).subscribe({
      next: (res: any) => {
        console.log('Update success', res);
        this.getAllCategories();
        this.resetForm()
      },
      error: (err: any) => console.error('Update error', err),
    });
  } else {
    
    this.api.addCategory(formData).subscribe({
      next: (res: any) => {
        console.log('Create success', res);
        this.getAllCategories();
        this.resetForm();
      },
      error: (err: any) => console.error('Create error', err),
    });
  }
}

 




  
  // getCategory() {
  //   this.api.getcategories().subscribe({
  //     next: (res: any) => {
  //       this.categories = Array.isArray(res) ? res : res.data || [];
  //       console.log('Users list:', this.categories);
  //     },
  //     error: (err) => console.error('Get users error:', err),
  //   });
  // }

  resetForm() {
    this.categoryForm.reset();
    this.openModal = false;
    this.selectedUserId = null;
  }
}
