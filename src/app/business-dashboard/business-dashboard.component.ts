import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-business-dashboard',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink,RouterModule],
  templateUrl: './business-dashboard.component.html',
  styleUrl: './business-dashboard.component.css',
})
export class BusinessDashboardComponent implements OnInit {

  loggedInBusiness: { name: string; loginTime: string } | null = null;
  timer: any;
items: any;
  constructor(private router: Router) {}
  ngOnInit(): void {
    const stored = localStorage.getItem('users');

    if (!stored) {
      this.router.navigateByUrl('/userlogin');
      return;
    }

    const parsed = JSON.parse(stored);

    const userName =
      parsed?.data?.user_name ||
      parsed?.user_name ||
      parsed?.data?.name ||
      parsed?.name ||
      'Business';

    this.loggedInBusiness = {
      name: userName,
      loginTime: new Date().toLocaleString(),
    };

    this.timer = setInterval(() => {
      const now = new Date();
      this.loggedInBusiness!.loginTime = now.toLocaleString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      });
    }, 1000);

    console.log('Parsed Business:', parsed);
  }


   logout() {
    localStorage.removeItem('business');
    localStorage.removeItem('businessToken')
    this.router.navigate(['/businesslogin']);
  }
}
