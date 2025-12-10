import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { BusinessService } from '../../Services/business.service';

@Component({
  selector: 'app-business-otp',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './business-otp.component.html',
  styleUrl: './business-otp.component.css'
})
export class BusinessOtpComponent implements OnInit {
  resetForm!: FormGroup;
 token: string | null = null;
   toastMessage: string | null = null;
  toastType: string | undefined;

  loading = false;
  message = '';
  constructor( private fb:FormBuilder,private router:Router, private service:BusinessService, private route: ActivatedRoute){}
ngOnInit(): void {
  this.resetForm= this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
  },
  { validators: this.matchPasswordValidator }
)
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

  this.service.businessResetPassword(body, this.token).subscribe({
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
