import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { BillingService } from '../billing.service';

declare var bootstrap: any;   

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    RouterOutlet,
    FormsModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  demoForm!: FormGroup;
  demoModal: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: BillingService
  ) {}

  ngOnInit(): void {
    this.demoForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }


  ngAfterViewInit(): void {
    const modalElement = document.getElementById('demoModal');

    if (modalElement) {
      this.demoModal = new bootstrap.Modal(modalElement);
    } else {
      console.error("Modal element #demoModal not found!");
    }
  }

 
  getstarteddemo() {
    if (this.demoModal) {
      this.demoModal.show();
    }
  }

 
sendEmail() {
  if (this.demoForm.invalid) {
    alert("Please fill all required fields");
    return;
  }

  this.api.sendDemoMail(this.demoForm.value).subscribe({
    next: (res: any) => {
      alert("Message Registered Successfully! Mail Sent ");
      this.demoForm.reset();

      if (this.demoModal) {
        this.demoModal.hide();
      }
    },
    error: (err: any) => {
      console.error(err);
      alert("Failed to send email");
    }
  });
}

}
