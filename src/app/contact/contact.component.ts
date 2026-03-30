import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { BillingService } from '../Services/billing.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterOutlet, RouterLink,FormsModule, CommonModule, ReactiveFormsModule ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
 demoForm!: FormGroup;
 toastMessage: string | null = null;
  toastType: 'success' | 'error' | 'info' | 'warning' | null = null;
constructor(private fb:FormBuilder, private router: Router, private api: BillingService){}
  ngOnInit(): void {
    this.demoForm = this.fb.group({
          name: ['', Validators.required],
          phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
          email: ['', [Validators.required, Validators.email]],
          message: ['', Validators.required],
        });
  }
   submitForm() {
    console.log('Working ');
    if (this.demoForm.invalid) {
      this.showToast('Please fill all required fields', 'error');
      return;
    }

    const payload = {
      name: this.demoForm.value.name,
      email: this.demoForm.value.email,
      phone: this.demoForm.value.phone,
      message: this.demoForm.value.message,
    };

    console.log('Sending payload:', payload);

    this.api.sendForm(payload).subscribe({
      
      next: (res: any) => {
              console.log(' SUCCESS RESPONSE:', res);

        this.showToast('Message Registered Successfully!', 'success');
        this.demoForm.reset();
       
        
      },
      error: (err: any) => {
          console.log(' ERROR RESPONSE:', err);
        console.error('Backend error:', err.error);
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
  testClick() {
  console.log('Button Clicked');
}
}
