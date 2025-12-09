import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { BillingService } from '../../Services/billing.service';

@Component({
  selector: 'app-user-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-reset-password.component.html',
  styleUrl: './user-reset-password.component.css',
})
export class UserResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  token: string | null = null;
  toastMessage: string | null = null;
  toastType: string | undefined;

  loading = false;
  message = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private service:BillingService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');

    this.resetForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
      },
      { validators: this.matchPasswordValidator }
    );
  }
  matchPasswordValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword')?.value;
  }
  updateUser() {
    if (this.resetForm.invalid) {
      this.showToast('warning', 'Please enter a valid password');
      return;
    }

    const body = {
      newPassword: this.resetForm.value.newPassword,
    };

    this.loading = true;

    this.service.userResetPassword(body, this.token).subscribe({
      next: () => {
        this.loading = false;
        this.showToast('success', 'Password reset successfully!');
        setTimeout(() => {
          this.router.navigate(['/userlogin']);
        }, 1000);
      },
      error: () => {
        this.loading = false;
        this.showToast('error', 'Failed to reset password');
      },
    });
  }
  showToast(message: string, type: string = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => (this.toastMessage = null), 3000);
  }
}
