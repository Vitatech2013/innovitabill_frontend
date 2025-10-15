import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-business-login',
  standalone: true,
  imports: [RouterOutlet,RouterLink,CommonModule,ReactiveFormsModule],
  templateUrl: './business-login.component.html',
  styleUrl: './business-login.component.css'
})
export class BusinessLoginComponent implements OnInit {
  businessForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

   ngOnInit(): void {
    this.businessForm = this.fb.group({
      email:['',Validators.required],
      password:['',Validators.required]
    });
  }

  login(){
    
  }

}
