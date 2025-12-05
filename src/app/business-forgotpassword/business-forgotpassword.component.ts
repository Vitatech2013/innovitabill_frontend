import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BusinessService } from '../business.service';

@Component({
  selector: 'app-business-forgotpassword',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './business-forgotpassword.component.html',
  styleUrls: ['./business-forgotpassword.component.css']   // ✔ Corrected (styleUrls)
})
export class BusinessForgotpasswordComponent implements OnInit {

  businessForm!: FormGroup;
  loading = false;
  message: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: BusinessService
  ) {}

  ngOnInit(): void {
    this.businessForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  sendOtp() {
    if (this.businessForm.invalid) {
      this.message = "Please enter a valid email";
      return;
    }

    this.loading = true;
    const email = this.businessForm.value.email;

    this.service.businessForgotpassword({ email})
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

  // Logout
  logout(): void {
    localStorage.removeItem('user');
    sessionStorage.clear();
    this.router.navigate(['/home']);
  }

}
