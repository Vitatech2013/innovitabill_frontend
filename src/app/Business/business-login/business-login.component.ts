import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { BusinessService } from '../../Services/business.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-business-login',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './business-login.component.html',
  styleUrl: './business-login.component.css',
})
export class BusinessLoginComponent implements OnInit {
  businessForm!: FormGroup;
  toastMessage: string | null = null;
  toastType: 'success' | 'error' | 'warning' = 'success';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: BusinessService,
    private toastr:ToastrService
  ) {}

  ngOnInit(): void {
    this.businessForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password:  [
    '',
    [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      ),
    ],
  ],
    });
  }

  login() {
    if (this.businessForm.invalid) {
      this.businessForm.markAllAsTouched();
      this.showToast('Please fill all required fields correctly!', 'warning');
      return;
    }

    this.service.businessLogin(this.businessForm.value).subscribe({
      next: (res: any) => {
        console.log('Login successful', res);

      if (res) {
       localStorage.setItem('user', JSON.stringify(res.data));   // ⭐ FIXED
localStorage.setItem('businessToken', JSON.stringify(res.token));


      }

        this.router.navigateByUrl('/business-Dashboard', {
          state: { toast: 'Business login successful!' },
        });

        this.showToast('Business login successful!', 'success');
      },

      error: (err: any) => {
        console.error('User login failed', err);

        if (err.status === 403) {
          this.showToast(
            'Your account is inactive. Please contact admin.',
            'warning'
          );
        } else if (err.status === 401) {
          this.showToast('Invalid email or password.', 'warning');
        } else if (err.status === 500) {
          this.showToast('Server error! Please try again later.', 'warning');
        } else {
          this.showToast('Login failed. Please try again.', 'warning');
        }
      },
    });
  }

  showToast(message: string, type: 'success' | 'error' | 'warning') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => (this.toastMessage = null), 3000);
  }
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/home']);
  }
  blockSpaces(event: KeyboardEvent) {
    if (event.code === 'Space') event.preventDefault();
  }
}
