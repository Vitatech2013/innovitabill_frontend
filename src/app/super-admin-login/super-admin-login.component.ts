import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink, RouterOutlet} from '@angular/router';
import { BillingService } from '../billing.service';

@Component({
  selector: 'app-super-admin-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
   RouterLink,
  ],
  templateUrl: './super-admin-login.component.html',
  styleUrl: './super-admin-login.component.css',
})
export class SuperAdminLoginComponent implements OnInit {
  superAdminForm!: FormGroup;
  toastMessage: string | null = null;
  toastType: string | undefined;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: BillingService
  ) {}

  ngOnInit(): void {
    this.superAdminForm = this.fb.group({
      superadmin_mail: ['', [Validators.required, Validators.email]],
      superadmin_password: ['', Validators.required],
    });
  }

  SuperAdminLogin() {
    if (this.superAdminForm.invalid) {
      this.showToast('Please enter valid credentials', 'danger');
      this.superAdminForm.markAllAsTouched();
      return;
    }

    this.api.SuperAdminLogin(this.superAdminForm.value).subscribe({
      next: (res: any) => {
        console.log(res, 'Super Admin Login Success');

        
        localStorage.setItem('sa', JSON.stringify(res.data));
        localStorage.setItem('sa_token', res.token);

        this.showToast('Super Admin Login Success', 'success');

        this.router.navigate(['/SuperAdminView'], {
          state: { toast: 'Super Admin login success' },
        });
      },

      error: (err: any) => {
        console.error('Super admin login failed', err);

        if (err.status === 403) {
          this.showToast(
            'Your account is inactive. Please contact system admin.',
            'danger'
          );
        } else if (err.status === 401) {
          this.showToast('Invalid email or password.', 'danger');
        } else if (err.status === 500) {
          this.showToast('Server error! Please try again later.', 'danger');
        } else {
          this.showToast('Login failed. Please try again.', 'danger');
        }
      },
    });
  }

  showToast(message: string, type: string) {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => (this.toastMessage = null), 3000);
  }
}
