import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { BillingService } from '../../Services/billing.service';
import { HttpClient } from '@angular/common/http';
import { constants } from '../../../../constants';

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
  
  showPassword: boolean = false;
  quotationForm!: FormGroup;
  private baseUrl = constants.baseUrl;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: BillingService,
    private toastr: ToastrService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    this.quotationForm = this.fb.group({
      business: this.fb.group({
        logo_image: [''],
        business_name: [''],
      }),
    });
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      user_email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false],
    });
    this.getBusinessDetails();
  }

  getBusinessDetails() {
    this.http.get<any>(`${this.baseUrl}/business/get`).subscribe({
      next: (b) => {
        if (!b || !b.data || b.data.length === 0) {
          console.warn('No business data found');
          return;
        }

        const business = b.data[0];

        const businessGroup = this.quotationForm.get('business') as FormGroup;

        let logoUrl = business.logo_image || '';
        if (logoUrl && !logoUrl.startsWith('http')) {
          logoUrl = `${this.baseUrl}/business_images/${logoUrl}`;
        }
        businessGroup.get('logo_image')?.setValue(logoUrl);
        businessGroup
          .get('business_name')
          ?.setValue(business.business_name || '');
      },
      error: (err) => {
        console.error('Failed to load business details', err);
      },
    });
  }
  UserLogin() {
    if (this.userForm.invalid) {
     this.toastr.warning("Please Enter Valid Credentials",'Warning')
      this.userForm.markAllAsTouched();
      return;
    }

    this.api.LoginUser(this.userForm.value).subscribe({
      next: (res: any) => {
        console.log('User Login Success Response:', res);

        localStorage.setItem('users', JSON.stringify(res.data));
        localStorage.setItem('us_token', res.token);

        const businessID =
          res?.data?.business_id?._id || res?.data?.business_id || null;

        if (businessID) {
          localStorage.setItem('business', JSON.stringify({ _id: businessID }));
          console.log('Stored business_id:', businessID);
        } else {
          console.warn(' Warning: business_id not found in login response');
        }

       this.toastr.success('User Login Success','Success',{
            positionClass: 'toast-top-right',
          });

        this.router.navigate(['/userview'], {
          state: { toast: 'User login success' },
        });
      },

      error: (err: any) => {
        console.error('User login failed', err);

        if (err.status === 401) {
          this.toastr.error('Invalid email or password', 'Login Failed');
        } else if (err.status === 403) {
          this.toastr.error(
            'Your account is inactive. Please contact admin.',
            'Access Denied'
          );
        } else if (err.status === 500) {
          this.toastr.error('Server error! Please try again later.', 'Error');
        } else {
          this.toastr.error('Login failed. Please try again.', 'Error');
        }
      },
    });
  }

 
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
