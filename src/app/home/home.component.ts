import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterOutlet, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
getstarteddemo() {
throw new Error('Method not implemented.');
}
  demoForm!: FormGroup;
  

  constructor(private fb: FormBuilder, private router:Router) {}

  ngOnInit(): void {
    this.demoForm = this.fb.group({
      name: ['', Validators.required],
      phone: [''],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });

    // const modalElement = document.getElementById('demoModal');
    // if (modalElement) {
    //   this.demoModal = new bootstrap.Modal(modalElement);
    // }
  }

  // getstarteddemo() {
  //   if (this.demoModal) {
  //     this.demoModal.show();
  //   }
  // }

  // submitDemoForm() {
  //   if (this.demoForm.valid) {
  //     console.log('Form Data:', this.demoForm.value);
  //     alert('Your demo request has been submitted successfully!');
  //     this.demoForm.reset();
  //     this.demoModal.hide();
  //   } else {
  //     alert('Please fill in all required fields!');
  //   }
  // }
}
