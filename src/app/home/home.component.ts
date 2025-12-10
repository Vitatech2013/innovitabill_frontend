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
import { BillingService } from '../Services/billing.service';


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
submitted = false;

  demoForm!: FormGroup;
  demoModal: any;

  toastMessage: string | null = null;
  toastType: 'success' | 'error' | 'info' | 'warning' | null = null;

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
    }
  }

  getstarteddemo() {
    if (this.demoModal) {
      this.demoModal.show();
    }
  }

  sendEmail() {
    if (this.demoForm.invalid) {
      this.showToast("Please fill all required fields", "error");
      return;
    }

    this.api.sendDemoMail(this.demoForm.value).subscribe({
      next: (res: any) => {
        this.showToast("Message Registered Successfully! Mail Sent", "success");
        this.demoForm.reset();
        this.demoModal?.hide();
      },
      error: (err: any) => {
        console.error(err);
        this.showToast("Failed to send email", "error");
      }
    });
  }

  showToast(message: string, type: 'success' | 'error' | 'info' | 'warning') {
    this.toastMessage = message;
    this.toastType = type;

    setTimeout(() => {
      this.toastMessage = null;
      this.toastType = null;
    }, 3000);
  }
}
