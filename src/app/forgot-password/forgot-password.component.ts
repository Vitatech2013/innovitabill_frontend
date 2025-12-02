import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BillingService } from '../billing.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit {

  forgotForm!: FormGroup;
  loading = false;
  message: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: BillingService
  ) {}

  ngOnInit(): void {
    this.forgotForm = this.fb.group({
      superadmin_mail: ['', [Validators.required, Validators.email]]
    });
  }

  forgot() {
    console.log(this.forgotForm.value);

    if (this.forgotForm.invalid) return;

    this.loading = true;

   
    const email = this.forgotForm.value.superadmin_mail;


    this.api.forgotPassword({ superadmin_mail: email })
      .subscribe({
        next: (res: any) => {
          this.message = res.message || 'Password reset link sent to your email';
          this.loading = false;
        },
        error: (err) => {
          this.message = err.error?.message || 'Something went wrong';
          this.loading = false;
        }
      });
  }
}
