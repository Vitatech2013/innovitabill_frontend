import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BusinessService } from '../../Services/business.service';


@Component({
  selector: 'app-business-forgotpassword',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './business-forgotpassword.component.html',
  styleUrls: ['./business-forgotpassword.component.css']   // ✔ Corrected (styleUrls)
})
export class BusinessForgotpasswordComponent implements OnInit {
loading: any;
message: any;

  
forgotForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: BusinessService
  ) {}

  ngOnInit(): void {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  forgot() {
    console.log(this.forgotForm.value);

    if (this.forgotForm.invalid) return;

    this.loading = true;

   
    const email = this.forgotForm.value.email;


    this.service.businessForgotpassword({ email: email })
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
