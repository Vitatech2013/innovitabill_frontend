import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BusinessService } from '../business.service';

@Component({
  selector: 'app-business-forgotpassword',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './business-forgotpassword.component.html',
  styleUrl: './business-forgotpassword.component.css'
})
export class BusinessForgotpasswordComponent implements OnInit {

businessForm!: FormGroup;
 constructor(private fb:FormBuilder, private router: Router, private service: BusinessService ){}

ngOnInit(): void {
    this.businessForm=this.fb.group({
      email:['',[Validators.required,Validators.email]]
    })
  }
  sendOtp(): void {
    if (this.businessForm.invalid) {
      this.businessForm.markAllAsTouched();
      return;
    }

    this.service.businessForgotpassword(this.businessForm.value).subscribe((res:any)=>{
      console.log(res,"forgot otp")
    })
    alert("OTP sent. Check your Email")
    this.router.navigate(['/business-otp']); 
  }
    
  
   //  Logout
    logout(): void {
      localStorage.removeItem('user');   // remove token from local storage
      sessionStorage.clear();             // clear session storage
      this.router.navigate(['/home']);    // redirect to home
    }

}
