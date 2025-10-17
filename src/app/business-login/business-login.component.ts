import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { BusinessService } from '../business.service';

@Component({
  selector: 'app-business-login',
  standalone: true,
  imports: [RouterOutlet,RouterLink,CommonModule,ReactiveFormsModule],
  templateUrl: './business-login.component.html',
  styleUrl: './business-login.component.css'
})
export class BusinessLoginComponent implements OnInit {
  businessForm!: FormGroup;
  toastMessage: string | null = null;
  toastType: 'success' | 'error' | 'warning' = 'success';

  constructor(private fb: FormBuilder, private router: Router,private service: BusinessService) {}

   ngOnInit(): void {
    this.businessForm = this.fb.group({
      email:['',[Validators.required, Validators.email]],
      password:['',[Validators.required, Validators.minLength(6)]]
    });
  }

login() {
  if (this.businessForm.invalid) {
    this.businessForm.markAllAsTouched();
    this.showToast('❌ Please fill all required fields correctly!', 'warning');
    return;
  }

  this.service.login(this.businessForm.value).subscribe({
    next: (res: any) => {
      console.log('Login successful', res);

      if (res.token) {
        localStorage.setItem('businessToken', res.token);
      }

      this.router.navigateByUrl('/business-Dashboard', {
        state: { toast: 'User login successful!' }
      });

      this.showToast('✅ User login successful!', 'success');
    },
    error: (err: any) => {
      console.error('Login failed:', err);
      this.showToast(err.error?.message || 'Invalid email or password', 'error');
    }
  });
}

showToast(message: string, type: 'success' | 'error' | 'warning') {
  this.toastMessage = message;
  this.toastType = type;
  setTimeout(() => (this.toastMessage = null), 3000);
}


}
