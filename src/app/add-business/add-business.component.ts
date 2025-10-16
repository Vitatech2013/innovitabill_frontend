import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router  } from '@angular/router';

@Component({
  selector: 'app-add-business',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-business.component.html',
  styleUrl: './add-business.component.css'
})
export class AddBusinessComponent implements OnInit {

  constructor(private router:Router){}
 ngOnInit(): void {

 }



 logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/SuperAdminLogin']);
  }

}
