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
  captchaText: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: BillingService,
  ) {}

  ngOnInit(): void {
    this.demoForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
    this.generateCaptcha();
  }
  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  preventSpace(event: KeyboardEvent) {
    if (event.code === 'Space') {
      event.preventDefault();
    }
  }
  onNameInput(event: Event, controlName: string) {
    const input = event.target as HTMLInputElement;

    const value = input.value
      .replace(/[^A-Za-z ]/g, '')
      .replace(/\s+/g, ' ')
      .trimStart();

    this.demoForm.get(controlName)?.setValue(value, { emitEvent: false });
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
  generateCaptcha() {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    this.captchaText = '';
    for (let i = 0; i < 6; i++) {
      this.captchaText += chars.charAt(
        Math.floor(Math.random() * chars.length),
      );
    }
  }

  // sendEmail() {
  //   if (this.demoForm.invalid) {
  //     this.showToast('Please fill all required fields', 'error');
  //     return;
  //   }

  //   const payload = {
  //     name: this.demoForm.value.name,
  //     email: this.demoForm.value.email,
  //     phone: this.demoForm.value.phone,
  //     message: this.demoForm.value.message,
  //   };

  //   console.log('Sending payload:', payload);

  //   this.api.sendDemoMail(payload).subscribe({
  //     next: (res: any) => {
  //       this.showToast('Message Registered Successfully!', 'success');
  //       this.demoForm.reset();
  //       this.demoModal?.hide();
  //     },
  //     error: (err: any) => {
  //       console.error('Full error:', err);
  //       console.error('Backend error:', err.error);
  //       this.showToast('Failed to send', 'error');
  //     },
  //   });
  // }


  sendEmail() {
  this.submitted = true;

  if (this.demoForm.invalid) {
    this.demoForm.markAllAsTouched(); // highlight all invalid fields
    this.showToast('Please fill all required fields', 'error');
    return;
  }

  const payload = {
    name: this.demoForm.value.name,
    email: this.demoForm.value.email,
    phone: this.demoForm.value.phone,
    message: this.demoForm.value.message,
  };

  this.api.sendDemoMail(payload).subscribe({
    next: (res: any) => {
      this.showToast('Message Registered Successfully!', 'success');
      this.demoForm.reset();
      this.submitted = false;
      this.demoModal?.hide();
    },
    error: (err: any) => {
      this.showToast('Failed to send', 'error');
    },
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
