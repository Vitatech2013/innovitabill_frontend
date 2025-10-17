import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink,  RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-business-dashboard',
  standalone: true,
  imports: [RouterOutlet,CommonModule,RouterLink],
  templateUrl: './business-dashboard.component.html',
  styleUrl: './business-dashboard.component.css'
})
export class BusinessDashboardComponent  implements OnInit{

  toastMessage:  string | null = null;
  toastType: 'success' | 'error' | 'warning' = 'success';

  constructor(private router: Router) {}

    ngOnInit(): void {
       const message = history.state?.toast || null;
    const type = history.state?.toastType || 'success';

    if (message) {
      this.showToast(message, type);
    }
  }
  showToast(message: string, type: 'success' | 'error' | 'warning') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => (this.toastMessage = null), 3000);
  }

  logout(): void {
    localStorage.removeItem('token');
    sessionStorage.clear();
    this.router.navigate(['/businesslogin']);
  }


}
