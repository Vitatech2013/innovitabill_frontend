// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { BillingService } from '../billing.service';
// import {
//   FormBuilder,
//   FormGroup,
//   FormsModule,
//   ReactiveFormsModule,
//   Validators,
// } from '@angular/forms';

// @Component({
//   selector: 'app-categories',
//   standalone: true,
//   imports: [CommonModule, FormsModule, ReactiveFormsModule],
//   templateUrl: './categories.component.html',
//   styleUrl: './categories.component.css',
// })
// export class CategoriesComponent implements OnInit {
  
//   categoryForm!: FormGroup;
//   categories: any[] = [];
//   business_id: any;

//   title = 'Add Category';
//   selectedCategoryId: any;
//   selectedUserId: string | null = null;
// cat: any;
  
// openModal: boolean = false;
//   user_id: any;

//   constructor(private api: BillingService, private fb: FormBuilder) {}

//   ngOnInit(): void {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       const user = JSON.parse(storedUser);
//       this.business_id = user._id || '';
//       this.user_id = user._id || '';
//       console.log('Business ID:', this.business_id);
//       console.log('User ID:', this.user_id);
//     }

//     this.categoryForm = this.fb.group({
//       categories_name:['',Validators.required],
//       categories_code:['',Validators.required],
//     });
//     this.getAllCategories();
//   }
//   getAllCategories() {
//     this.api.getcategories().subscribe({
//       next: (res: any) => {
//         this.categories = Array.isArray(res) ? res : res.data || [];
//         console.log('Categories Loaded:', res.categories);
//       },
//       error: (err) => console.error('Error Loading:', err),
//     });
//   }

//     openAddModal() {
//     this.title = 'Add Category';
//    this.openModal = true;
//     this.resetForm();
//   }


//     edit(cat: any): void {
//     this.selectedUserId = cat._id;
//     this.title = 'Edit Category';
//     this.categoryForm.patchValue({
//       categories_name: cat.categories_name || cat.categories_name,
//       categories_code: cat.categories_code || cat.categories_code,
     
//     });
//     this.openModal= true;
//   }

//   delete(id: string) {
//     if (!confirm('Are you sure you want to delete this user?')) return;
//     this.api.deleteCategory(id).subscribe({
//       next: () => {
//         alert('User deleted successfully');
//         this.getAllCategories();
//       },
//       error: (err) => console.error('Delete error', err),
//     });
//   }

//  createOrUpdateCategory(): void {
//   if (this.categoryForm.invalid) {
//       alert('Please fill all required fields correctly');
//       return;
//     }

//   const formData = new FormData();
//   formData.append('category_name', this.categoryForm.get('category_name')?.value);
//   formData.append('categories_code', this.categoryForm.get('categories_code')?.value);
//   formData.append('user_id', this.categoryForm.get('user_id')?.value);
//   formData.append('business_id', this.categoryForm.get('business_id')?.value);

//   if (this.selectedCategoryId) {
  
//     this.api.updateCategory(this.selectedCategoryId, formData).subscribe({
//       next: (res: any) => {
//         console.log('Update success', res);
//         this.getAllCategories();
//         this.resetForm()
//       },
//       error: (err: any) => console.error('Update error', err),
//     });
//   } else {
    
//     this.api.addCategory(formData).subscribe({
//       next: (res: any) => {
//         console.log('Create success', res);
//         this.getAllCategories();
//         this.resetForm();
//       },
//       error: (err: any) => console.error('Create error', err),
//     });
//   }
// }


//   resetForm() {
//     this.categoryForm.reset();
//     this.openModal = false;
//     this.selectedUserId = null;
//   }
// }


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
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  categoryForm!: FormGroup;
  categories: any[] = [];
  business_id: string = '';
  user_id: string = '';
  title = 'Add Category';
  selectedCategoryId: string | null = null;

  constructor(private api: BillingService, private fb: FormBuilder) {}

  ngOnInit(): void {
   
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.business_id = user._id || '';
      this.user_id = user._id || '';
    }

    this.categoryForm = this.fb.group({
      categories_name: ['', Validators.required],
      categories_code: ['', Validators.required],
      user_id: [''],
      business_id: [''],
    });

    this.getAllCategories();
  }

  getAllCategories() {
    this.api.getcategories().subscribe({
      next: (res: any) => {
        this.categories = res.data || res;
        console.log('Categories Loaded:', this.categories);
      },
      error: (err) => console.error('Error Loading:', err),
    });
  }

  openAddModal() {
    this.title = 'Add Category';
    this.selectedCategoryId = null;
    this.categoryForm.reset();
    (document.getElementById('CategoryModal') as any)?.classList.add('show');
  }

  edit(cat: any) {
    this.title = 'Edit Category';
    this.selectedCategoryId = cat._id;
    this.categoryForm.patchValue({
      categories_name: cat.categories_name,
      categories_code: cat.categories_code,
    });
    (document.getElementById('CategoryModal') as any)?.classList.add('show');
  }


  closeModal() {
    (document.getElementById('CategoryModal') as any)?.classList.remove('show');
    this.categoryForm.reset();
    this.selectedCategoryId = null;
  }


  delete(id: string) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    this.api.deleteCategory(id).subscribe({
      next: () => {
        alert('Category deleted successfully');
        this.getAllCategories();
      },
      error: (err) => console.error('Delete error', err),
    });
  }

  createOrUpdateCategory() {
    if (this.categoryForm.invalid) {
      alert('Please fill all required fields');
      return;
    }
    this.categoryForm.patchValue({
      user_id: this.user_id,
      business_id: this.business_id,
    });

    if (this.selectedCategoryId) {
      // update
      this.api.updateCategory(this.selectedCategoryId, this.categoryForm.value).subscribe({
        next: (res) => {
          alert('Category updated successfully');
          this.getAllCategories();
          this.closeModal();
        },
        error: (err) => {
          console.error('Update error', err);
        },
      });
    } else {
      // create
      this.api.addCategory(this.categoryForm.value).subscribe({
        next: (res) => {
          alert('Category added successfully');
          this.getAllCategories();
          this.closeModal();
        },
        error: (err) => {
          console.error('Create error', err);
        },
      });
    }
  }
}
