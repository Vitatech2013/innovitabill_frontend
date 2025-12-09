import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BillingService } from '../../Services/billing.service';


@Component({
  selector: 'app-user-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-forgot-password.component.html',
  styleUrl: './user-forgot-password.component.css',
})
export class UserForgotPasswordComponent implements OnInit {
  forgotUserForm!: FormGroup;
  loading = false;
  message: string = '';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: BillingService
  ) {}
  ngOnInit(): void {
    this.forgotUserForm = this.fb.group({
      user_email: ['', [Validators.required, Validators.email]],
    });
  }

  forgot() {
    console.log(this.forgotUserForm.value);

    if (this.forgotUserForm.invalid) return;

    this.loading = true;

    const email = this.forgotUserForm.value.user_email;

    this.service.userForgotPassword({ user_email: email }).subscribe({
      next: (res: any) => {
        this.message = res.message || 'Password reset link sent to your email';
        this.loading = false;
      },
      error: (err) => {
        this.message = err.error?.message || 'Something went wrong';
        this.loading = false;
      },
    });
  }
}
