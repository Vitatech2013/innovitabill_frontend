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
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: BillingService
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      user_email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
   UserLogin() {
    if (this.userForm.invalid) {
      this.showToast('please enter valid credentials', 'danger');
      this.userForm.markAllAsTouched();
      return;
    }
    this.api.UserLogin(this.userForm.value).subscribe({
      next:(res:any)=>{
        console.log(res,"User Login Sucess");
        const user=localStorage.setItem("users",JSON.stringify(res.data),)
       const us_token= localStorage.setItem("us_token",JSON.stringify(res.token),)
        console.log(user,us_token )
        this.showToast("User Login Success","success");
        this.router.navigate(['/userview'],{
          state:{toast:"User login success"}
        });
      },
      error: (err: any) => {
        console.error('User login failed', err);
        this.showToast('Invalid Credentials', 'danger');
      },
    });
  }
  showToast(message: string, type: string) {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => (this.toastMessage = null), 3000);
  }
}
