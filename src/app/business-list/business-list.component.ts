import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { BillingService } from '../billing.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-business-list',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './business-list.component.html',
  styleUrl: './business-list.component.css'
})
export class BusinessListComponent  implements OnInit{

business: any[]=[];

constructor(private api:BillingService,private fb:FormBuilder,private router:Router){}

  ngOnInit(): void {

this.loadbusiness()
  }
  loadbusiness() {
    throw new Error('Method not implemented.');
  }

}
