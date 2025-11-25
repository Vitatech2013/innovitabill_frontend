import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BusinessService } from '../business.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-business-otp',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './business-otp.component.html',
  styleUrl: './business-otp.component.css'
})
export class BusinessOtpComponent implements OnInit {
  otpForm: any;

  constructor( private fb:FormBuilder,private router:Router, private service:BusinessService){}
ngOnInit(): void {
  this.otpForm= this.fb.group({
    email:['',[Validators.required]],
      otp: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],  
    
  })
}
  resetPassword(): void {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }
 this.service.businessResetPassword(this.otpForm.value).subscribe((res:any)=>{
      console.log(res,"reset OTP");
      this.router.navigate(['/home']);
      alert("Reset Password successfully")
    })
  }


}
