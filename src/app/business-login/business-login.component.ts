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

  constructor(private fb: FormBuilder, private router: Router,private service: BusinessService) {}

   ngOnInit(): void {
    this.businessForm = this.fb.group({
      email:['',[Validators.required, Validators.email]],
      password:['',[Validators.required, Validators.minLength(6)]]
    });
  }

  login(){
    if(this.businessForm.invalid) {
      return;
    }
    this.service.login(this.businessForm.value).subscribe({
      next: (res: any)=> {
        console.log(res, 'Login successfull');
        this.router.navigateByUrl(('/business-Dashboard')); 
      },
      error:(err: any)=> {
        console.error('Login failed',err);
      }
    })

  }

}
