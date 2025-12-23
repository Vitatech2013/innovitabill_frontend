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
toastMessage: any;
toastType: any;
  selectedId: any;
  searchTerm: string = '';
  statusFilter: 'active' | 'inactive'|'all' = 'all';

  constructor(private api: BillingService, private fb: FormBuilder) {}

  ngOnInit(): void {
   
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.business_id = user._id || '';
      this.user_id = user._id || '';
    }

    this.categoryForm = this.fb.group({
      categories_name: ['', [Validators.required,  Validators.pattern(/^[A-Za-z]+( [A-Za-z]+)*$/)]],
      categories_code: ['', Validators.required],
      status:['',Validators.required],
      user_id: [''],
      business_id: [''],

    });

    this.getAllCategories();
  }

  // getAllCategories() {
  //   this.api.getcategories().subscribe({
  //     next: (res: any) => {
  //       this.categories = res.data || res;
  //       console.log('Categories Loaded:', this.categories);
  //     },
  //     error: (err) => console.error('Error Loading:', err),
  //   });
  // }
  getAllCategories() {
  this.api.getcategories().subscribe({
    next: (res: any) => {
      this.categories = (res.data || res)
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      console.log('Categories Loaded (Latest First):', this.categories);
    },
    error: (err) => console.error('Error Loading:', err),
  });
}

allowLettersAndSpace(event: KeyboardEvent) {
   const allowedKeys = [
    'Backspace',
    'Delete',
    'ArrowLeft',
    'ArrowRight',
    'Tab'
  ];

  if (allowedKeys.includes(event.key)) {
    return;
  }

  if (!/^[a-zA-Z ]$/.test(event.key)) {
    event.preventDefault();
  }
}




  openAddModal() {
    this.title = 'Add Category';
    this.selectedCategoryId = null;
    this.categoryForm.reset();
    (document.getElementById('CategoryModal') as any)?.classList.add('show');
  }
onNameInput(event: any, controlName: string) {
   const input = event.target as HTMLInputElement;

    const value = input.value
      .replace(/[^A-Za-z ]/g, '')
      .replace(/\s+/g, ' ')
      .trimStart();

    this.categoryForm
      .get(controlName)
      ?.setValue(value, { emitEvent: false });
}


  edit(cat: any) {
    this.title = 'Edit Category';
    this.selectedCategoryId = cat._id;
    this.categoryForm.patchValue({
      categories_name: cat.categories_name,
      categories_code: cat.categories_code,
      status: cat.status || cat.business_status || cat.status?.status || "",

    });
    (document.getElementById('CategoryModal') as any)?.classList.add('show');
  }


  closeModal() {
    (document.getElementById('CategoryModal') as any)?.classList.remove('show');
    this.categoryForm.reset();
    this.selectedCategoryId = null;
  }


  createOrUpdateCategory() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      this.showToast('Please fill all required fields','warning');
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
          this.showToast('Category updated successfully','success');
          this.getAllCategories();
          this.closeModal();
          const modal = bootstrap.Modal.getInstance(document.getElementById('CategoryModal'));
        modal.hide();
        },
        error: (err) => {
          console.error('Update error', err);
          this.showToast('Failed to update ', 'error');
        },
      });
    } else {
      // create
      this.api.addCategory(this.categoryForm.value).subscribe({
        next: (res) => {
          this.showToast('Category added successfully','success');
          this.getAllCategories();
          this.closeModal();
          const modal = bootstrap.Modal.getInstance(document.getElementById('CategoryModal'));
        modal.hide();
        
        },
        error: (err) => {
          console.error('Create error', err);
       this.showToast('Failed to add category', 'error');

        },
      });
    }
  }
    filteredUser() {
    if (!this.searchTerm) return this.categories;
    const term = this.searchTerm.toLowerCase();
    return this.categories.filter((u: any) =>
      Object.values(u).some((val) =>
        val?.toString().toLowerCase().includes(term)
      )
    );
  }
  filteredByStatus(): any[] {
    if (this.statusFilter === 'all') {
    return this.filteredUser();
  }
  return this.filteredUser().filter(
    (u: any) => u?.status === this.statusFilter
  );
}
  openDeleteModal(cats: any) {
    this.selectedId = cats;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
  }
  confirmDelete() {
    if (!this.selectedId) return;
    this.api.deleteCategory(this.selectedId._id).subscribe({
      next: () => {
                this.showToast('category deleted successfully', 'success');

        this.getAllCategories();
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        modal.hide();
      },
      error: (err) =>{ 
        console.error('Delete error', err);
         this.showToast('Failed to delete unit', 'error');
      },
    });
  }
   showToast(message: string, type: 'success' | 'error' | 'warning') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => (this.toastMessage = null), 3000);
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
  blockSpaces(event: KeyboardEvent) {
    if (event.code === 'Space') event.preventDefault();
  }
}
