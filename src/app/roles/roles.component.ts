import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BillingService } from '../billing.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent  implements OnInit{
openAddModal() {
throw new Error('Method not implemented.');
}


  Roles: any;

constructor(private api:BillingService){}

  ngOnInit(): void {
    this.getAllRoles()
  }
 getAllRoles() {
    this.api.getRoles().subscribe({
      next: (res: any) => {
        this.Roles = res;
        console.log('Roles loaded:', res);
      },
      error: (err) => console.error('Error loading roles:', err)
    });
  }

}
