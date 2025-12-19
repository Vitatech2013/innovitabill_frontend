import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterModule,
  RouterOutlet,
} from '@angular/router';

@Component({
  selector: 'app-business-dashboard',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, RouterModule],
  templateUrl: './business-dashboard.component.html',
  styleUrl: './business-dashboard.component.css',
})
export class BusinessDashboardComponent implements OnInit {
  loggedInBusiness: { name: string; loginTime: string } | null = null;
  timer: any;
  toastMessage: string | null = null;
  toastType: 'success' | 'error' | 'warning' = 'success';
  constructor(private router: Router) {}
  ngOnInit(): void {
    const stored = localStorage.getItem('user');

    if (!stored) {
      this.router.navigateByUrl('/businesslogin');
      return;
    }

    const parsed = JSON.parse(stored);

    const businessName =
      parsed?.data?.business_name ||
      parsed?.business_name ||
      parsed?.data?.name ||
      parsed?.name ||
      'Business';

    this.loggedInBusiness = {
      name: businessName,
      loginTime: new Date().toLocaleString(),
    };
     const message = sessionStorage.getItem('toastMessage');
  const type = sessionStorage.getItem('toastType') as
    | 'success'
    | 'warning'
    | 'error';

  if (message) {
    this.showToast(message, type || 'success');

  
    sessionStorage.removeItem('toastMessage');
    sessionStorage.removeItem('toastType');
  }

    // this.timer = setInterval(() => {
    //   const now = new Date();
    //   this.loggedInBusiness!.loginTime = now.toLocaleString('en-US', {
    //     year: 'numeric',
    //     month: 'numeric',
    //     day: 'numeric',
    //     hour: 'numeric',
    //     minute: 'numeric',
    //     second: 'numeric',
    //     hour12: true,
    //   });
    // }, 1000);

    // console.log('Parsed Business:', parsed);
  }

     showToast(message: string, type: 'success' | 'error' | 'warning') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => (this.toastMessage = null), 2000);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('businessToken');
    this.router.navigate(['/businesslogin']);
  }
}
