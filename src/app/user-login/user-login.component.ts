import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { BillingService } from '../billing.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css',
})
export class UserLoginComponent implements OnInit {
  userForm!: FormGroup;
  toastMessage: string | null = null;
  toastType: string | undefined;
  business_id: string = '';
  user_id: string = '';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: BillingService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      user_email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    // const storedUser = localStorage.getItem('business');
    // if (storedUser) {
    //   const user = JSON.parse(storedUser);
    //   this.business_id = user._id || '';
    //   this.user_id = user._id || '';
    // }
  }

  UserLogin() {
    if (this.userForm.invalid) {
      this.showToast('Please enter valid credentials', 'danger');
      this.userForm.markAllAsTouched();
      return;
    }
    this.api.LoginUser(this.userForm.value).subscribe({
      next: (res: any) => {
        console.log(res, 'User Login Success');

        localStorage.setItem('users', JSON.stringify(res.data));
        localStorage.setItem('us_token', res.token);

        this.showToast('User Login Success', 'success');

        this.router.navigate(['/userview'], {
          state: { toast: 'User login success' },
        });
      },

      error: (err: any) => {
        console.error('User login failed', err);

        if (err.status === 403) {
          this.showToast(
            'Your account is inactive. Please contact admin.',
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
