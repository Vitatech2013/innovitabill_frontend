import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BillingService } from '../Services/billing.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

declare var bootstrap: any;

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css',
})
export class ExpensesComponent implements OnInit {
  toastMessage: string | null = null;
  toastType: 'success' | 'error' | 'warning' = 'success';

  searchTerm: string = '';
  selectedFilter: string = 'Active';
  statusFilter: 'active' | 'inactive' | 'all' = 'active';

  showPassword = false;

  expenses: any[] = [];
  expensesForm!: FormGroup;
  selectedExpense: any;

  business_id: string | null = null;
  user_id: string | null = null;
  controls: any;

  constructor(
    private fb: FormBuilder,
    private service: BillingService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    const storedExpenses = localStorage.getItem('user');

    if (storedExpenses && storedExpenses !== '{}') {
      const user = JSON.parse(storedExpenses);

      this.business_id =
        user._id || user.business_id || user.businessId || user.id || '';

      this.user_id = user.user_id || user._id || '';
    }

    this.expensesForm = this.fb.group({
      billPurpose: ['', [Validators.required, Validators.minLength(3)]],
      billAmount: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      date: ['', Validators.required],
      // billingFrom: ['', Validators.required],
      // billingTo: ['', Validators.required],
      // unitsConsumed: [0, Validators.required],
      // ratePerUnit: [0, Validators.required],
      // totalBillAmount: [0, Validators.required],
      // dueDate: ['', Validators.required],
      // paymentStatus: ['Unpaid', Validators.required],
    });

    this.getExpenses();
  }
  formatDateForInput(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  }

  getExpenses() {
    this.service.getExpenses().subscribe({
      next: (res: any) => {
        console.log('API response:', res);
        this.expenses = res?.data || [];
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
  viewExpense(expense: any) {
    this.selectedExpense = expense;
  }
 
  createExpenses() {
    if (this.expensesForm.invalid) {
      this.expensesForm.markAllAsTouched();
      this.toastMessage = 'Please fill required fields';
      this.toastType = 'warning';
      return;
    }

    const form = this.expensesForm.value;

    const payload = {
      billPurpose: form.billPurpose,
      billAmount: form.billAmount,
      date: form.date,
      business_id: this.business_id,
      user_id: this.user_id,
    };

    this.service.addExpenses(payload).subscribe({
      next: (res: any) => {
        this.toastMessage = 'Expense Added Successfully';
        this.toastType = 'success';

        this.expensesForm.reset();
        this.getExpenses();

        const modal = document.getElementById('AddModal');
        if (modal) {
          const modalInstance = bootstrap.Modal.getInstance(modal);
          modalInstance.hide();
        }
      },
      error: (err: any) => {
        console.log(err);
        this.toastMessage = 'Error adding expense';
        this.toastType = 'error';
      },
    });
  }


  editExpense(expense: any) {
    this.selectedExpense = expense;
    const formatDate = (date: string) => {
      if (!date) return '';
      const [year, month, day] = date.split('-');
      const paddedYear = year.padStart(4, '0');
      return `${paddedYear}-${month}-${day}`;
    };
    this.expensesForm.patchValue({
      billPurpose: expense.billPurpose,
      billAmount: expense.billAmount,
      date: expense.date,
    });
  }

  
  updateExpense() {
    if (!this.selectedExpense) return;

    const form = this.expensesForm.value;

    const payload = {
      billPurpose: form.billPurpose,
      billAmount: form.billAmount,
      date: form.date,
      // billingFrom: this.formatDateForInput(form.billingFrom),
      // billingTo: this.formatDateForInput(form.billingTo),
      // unitsConsumed: form.unitsConsumed,
      // ratePerUnit: form.ratePerUnit,
      // totalBillAmount: form.totalBillAmount,
      // dueDate: this.formatDateForInput(form.dueDate),
      // paymentStatus: form.paymentStatus,
    };
    console.log('Updating expense:', payload);
    this.service.updateExpenses(this.selectedExpense._id, payload).subscribe({
      next: (res: any) => {
        this.toastMessage = 'Expense Updated Successfully';
        this.toastType = 'success';

        this.getExpenses();

        const modal = document.getElementById('editModal');
        if (modal) {
          const modalInstance = bootstrap.Modal.getInstance(modal);
          modalInstance.hide();
        }
      },

      error: (err: any) => {
        console.log(err);
        this.toastMessage = 'Update Failed';
        this.toastType = 'error';
      },
    });
  }


  openDeleteModal(expense: any) {
    this.selectedExpense = expense;
  }


  confirmDelete() {
    if (!this.selectedExpense) return;

    this.service.deleteExpenses(this.selectedExpense._id).subscribe({
      next: () => {
        this.toastMessage = 'Expense Deleted Successfully';
        this.toastType = 'success';

        this.getExpenses();

        const modal = document.getElementById('deleteModal');
        if (modal) {
          const modalInstance = bootstrap.Modal.getInstance(modal);
          modalInstance.hide();
        }
      },

      error: (err: any) => {
        console.log(err);
        this.toastMessage = 'Delete Failed';
        this.toastType = 'error';
      },
    });
  }

  
  filteredUser(): any[] {
    if (!Array.isArray(this.expenses)) return [];

    if (!this.searchTerm) return this.expenses;

    const term = this.searchTerm.toLowerCase();

    return this.expenses.filter((e: any) =>
      Object.values(e || {}).some((val) =>
        String(val).toLowerCase().includes(term),
      ),
    );
  }

  // FILTER
  filteredByStatus(): any[] {
    if (this.statusFilter === 'all') {
      return this.filteredUser();
    }

    return this.filteredUser().filter(
      (u: any) => u?.status === this.statusFilter,
    );
  }

  changeFilter(value: string) {
    this.selectedFilter = value;

    switch (value) {
      case 'All':
        this.showall();
        break;

      case 'Active':
        this.showActive();
        break;

      case 'Inactive':
        this.showInactive();
        break;
    }
  }

  showActive() {
    this.statusFilter = 'active';
  }

  showInactive() {
    this.statusFilter = 'inactive';
  }

  showall() {
    this.statusFilter = 'all';
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
