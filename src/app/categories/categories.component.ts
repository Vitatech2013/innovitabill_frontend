import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BillingService } from '../billing.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  r: any;
  categoryForm!: FormGroup;

  categories: any;

  business_id: any;
  selectedUserId: any;
title= 'Add Category';
 

  constructor(private api: BillingService,private fb:FormBuilder) {}

  ngOnInit(): void {
    const bid = JSON.parse(localStorage.getItem('bid') || '{}');
    console.log('Stored bid:', bid);
    this.business_id = bid._id;
    console.log(this.business_id, 'business_id');
    this.categoryForm= this.fb.group({

    })
    this.getAllCategories();
  }
  getAllCategories() {
    this.api.getcategories().subscribe({
      next: (res: any) => {
        this.categories = res.data;
        console.log('Categories Loaded:', res.data);
      },
      error: (err) => console.error('Error Loading:', err),
    });
  }
  createOrUpdateRole() {
    throw new Error('Method not implemented.');
  }

  edit(cat: any) {
    this.selectedUserId = cat._id;
  }
  delete(arg0: any) {
    throw new Error('Method not implemented.');
  }

  closeModal() {
    throw new Error('Method not implemented.');
  }
}
