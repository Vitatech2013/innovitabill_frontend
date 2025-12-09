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

declare var bootstrap: any;

@Component({
  selector: 'app-sub-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './sub-categories.component.html',
  styleUrl: './sub-categories.component.css',
})
export class SubCategoriesComponent implements OnInit {
  subCategoryForm!: FormGroup;
 subcategories: any[] = [];
  selectedcategory: any;
  title: any;

  toastMessage: any;
  toastType: any;
  openModel = false;
  business_id: any;
  user_id: any;
  c: any;
  categories_id: any;

  constructor(private fb: FormBuilder, private api: BillingService) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.business_id = user._id || '';
      this.user_id = user._id || '';
      this.categories_id = user._id || ''
    }

    this.subCategoryForm = this.fb.group({
      sub_category_name: ['', Validators.required],
      sub_category_code: ['', Validators.required],
      // categories_id: ['', Validators.required], // <-- Add this
      // user_id: [''],
      // business_id: [''],
      status: ['', Validators.required],
    });
    this.getallSc();
  }
  // getallSc() {
  //   this.api.getSubCategories().subscribe((res: any)=>{
  //     this.subcategories = res.data;
  //     console.log('subcategory', this.subcategories);
  //   });
  // }

  getallSc() {
    this.api.getSubCategories().subscribe((res: any) => {
      console.log('API Full Response:', res);
      this.subcategories = res?.data ?? [];
   
    });
  }

  openAddModal(): void {
    this.title = 'Add subcategory';
    this.selectedcategory = null;
    this.subCategoryForm.reset();
    (document.getElementById('subcategoryModel') as any)?.classList.add('show');
  }
  resetForm() {
    this.subCategoryForm.reset();
    this.selectedcategory = null;
  }

  closeModal() {
    (document.getElementById('subcategoryModel') as any)?.classList.remove(
      'show'
    );
    this.subCategoryForm.reset();
    this.selectedcategory = null;
  }

//   createOrUpdateSc(): void {
//   if (this.subCategoryForm.invalid) {
//     this.subCategoryForm.markAllAsTouched();
//     this.showToast('Please fill all required fields!', 'warning');
//     return;
//   }

//   const payload = {
//   ...this.subCategoryForm.value,
//   user_id: this.user_id,
//   business_id: this.business_id,
//   categories_id: this.categories_id?._id || this.categories_id,
// };

//   if (this.selectedcategory) {
//     this.api.updateSubcat(this.selectedcategory, payload).subscribe((res: any) => {
//       this.subcategories = res.data;
//       this.showToast('Sub Category updated successfully!', 'success');
//       this.getallSc();
//       this.closeModal();
//       bootstrap.Modal.getInstance(document.getElementById('subcategoryModel'))?.hide();
//     });
//   } else {
//     this.api.addSubcat(payload).subscribe((res: any) => {
//       console.log('created:', res);
//       this.showToast('Category added successfully!', 'success');
//       this.getallSc();
//       this.closeModal();
//       bootstrap.Modal.getInstance(document.getElementById('subcategoryModel'))?.hide();
//     });
//   }
// }

createOrUpdateSc(): void {
  if (this.subCategoryForm.invalid) {
    this.subCategoryForm.markAllAsTouched();
    this.showToast('Please fill all required fields!', 'warning');
    return;
  }

  const payload = {
    ...this.subCategoryForm.value,
    user_id: this.user_id,
    business_id: this.business_id,
    categories_id: this.categories_id?._id || this.categories_id,
  };

  if (this.selectedcategory) {
  this.api.updateSubcat(this.selectedcategory._id, payload).subscribe({
    next: (res: any) => {
      this.subcategories = res.data;
      this.showToast('Sub Category updated successfully!', 'success');
      this.getallSc();
      this.closeModal();
      bootstrap.Modal.getInstance(document.getElementById('subcategoryModel'))?.hide();
    },
    error: (err) => {
      console.error('Update error', err);
      this.showToast('Failed to update subcategory', 'error');
    },
  });
}

 else {
    this.api.addSubcat(payload).subscribe((res: any) => {
      this.showToast('Subcategory added successfully!', 'success');
      this.getallSc();
      this.closeModal();
      bootstrap.Modal.getInstance(document.getElementById('CategoryModal'))?.hide();
    });
  }
}


  showToast(message: string, type: 'success' | 'error' | 'warning') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => (this.toastMessage = null), 3000);
  }

  
//   edit(data: any) {
//   this.selectedcategory = data._id;

//   this.subCategoryForm.patchValue({
//     sub_category_name: data.sub_category_name,
//     sub_category_code: data.sub_category_code,
//     categories_id: data.categories_id?._id || data.categories_id, // ✔ Safe access
//     status: data.status
//   });

//   const modal = new bootstrap.Modal(document.getElementById('subcategoryModel'));
//   modal.show();
// }

edit(data: any) {
  if (!data || !data._id) {
    console.error('Invalid category data:', data);
    return;
  }

  this.selectedcategory = data;

  this.subCategoryForm.patchValue({
    sub_category_name: data.sub_category_name,
    sub_category_code: data.sub_category_code,
    categories_id: data.categories_id?._id || data.categories_id,
    status: data.status,
  });

  const modal = new bootstrap.Modal(document.getElementById('subcategoryModel'));
  modal.show();
}

openDeleteModal(cats: any) {
    this.selectedcategory = cats;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
  }
confirmDelete() {
  if (!this.selectedcategory) return;

  this.api.deleteSubCat(this.selectedcategory._id).subscribe({
    next: () => {
      this.showToast('Subcategory deleted successfully', 'success');
      this.getallSc();
      bootstrap.Modal.getInstance(document.getElementById('deleteModal'))?.hide();
    },
    error: (err) => {
      console.error('Delete error', err);
      this.showToast('Failed to delete subcategory', 'error');
    },
  });
}

allowOnlyLetters(event: KeyboardEvent) {
  const pattern = /^[A-Za-z]$/;
  if (!pattern.test(event.key)) {
    event.preventDefault(); // blocks numbers, spaces, special characters
  }
}
// allowOnlyNumbers(event: KeyboardEvent) {
//   const pattern = /^[0-9]$/;
//   if (!pattern.test(event.key)) {
//     event.preventDefault(); // blocks letters and special characters
//   }
// }

}
