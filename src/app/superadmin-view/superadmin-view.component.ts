import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-superadmin-view',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './superadmin-view.component.html',
  styleUrl: './superadmin-view.component.css'
})
export class SuperadminViewComponent implements OnInit{

    constructor(private router:Router){}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/SuperAdminLogin']);
  }
}
