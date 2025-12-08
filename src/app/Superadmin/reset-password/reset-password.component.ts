import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BillingService } from '../../Services/billing.service';


@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {

  resetForm!: FormGroup;
  token: string | null = null;
   toastMessage: string | null = null;
  toastType: string | undefined;

  loading = false;
  message = '';

  constructor(
    private fb: FormBuilder,
    private api: BillingService,
    private router: Router,
    private route: ActivatedRoute
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

update() {
  if (this.resetForm.invalid) {
    this.showToast('warning', 'Please enter a valid password');
    return;
  }

  const body = {
    newPassword: this.resetForm.value.newPassword
  };

  this.loading = true;

  this.api.resetPassword(body, this.token).subscribe({
    next: () => {
      this.loading = false;
      this.showToast('success', 'Password reset successfully!');
      setTimeout(() => {
        this.router.navigate(['/SuperAdminLogin']);
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
