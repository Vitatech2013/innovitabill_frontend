import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cashier-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './cashier-login.component.html',
  styleUrl: './cashier-login.component.css'
})
export class CashierLoginComponent implements OnInit {
cashierForm!:FormGroup;
constructor(private fb:FormBuilder, private router:Router){}

ngOnInit(): void {
  this.cashierForm= this.fb.group({
    mobile_number: ['', [Validators.required, Validators.minLength(10)]],
     password: ['', [Validators.required, Validators.minLength(5)]],
  })
}

cashierLogin(){

}
}
