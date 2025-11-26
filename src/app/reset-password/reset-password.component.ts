import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BillingService } from '../billing.service';

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

  this.resetForm = this.fb.group({
    password: ['', Validators.required],
    confirm_password: ['', Validators.required],
  });
}

update() {
  if (this.resetForm.invalid) return;

  if (this.resetForm.value.password !== this.resetForm.value.confirm_password) {
    this.message = "Passwords do not match";
    return;
  }

  const body = {
    newPassword: this.resetForm.value.password   
  };

  this.loading = true;

  this.api.resetPassword(body, this.token).subscribe({
    next: () => {
      this.loading = false;
      this.message = 'Password reset successful!';
      this.router.navigate(['/SuperAdminLogin']);
    },
    error: (err) => {
      this.loading = false;
      console.log(err);
      this.message = 'Unable to reset password';
    },
  });
}
}
