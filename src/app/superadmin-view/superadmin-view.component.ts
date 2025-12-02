import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-superadmin-view',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterModule],
  templateUrl: './superadmin-view.component.html',
  styleUrl: './superadmin-view.component.css',
})
export class SuperadminViewComponent implements OnInit {

  loggedInUser: { name: string; loginTime: string } | null = null;
  timer: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const stored = localStorage.getItem('sa');

    if (!stored) {
      this.router.navigateByUrl('/SuperAdminLogin');
      return;
    }

    const parsed = JSON.parse(stored);

    
    const superadminName =
      parsed?.data?.superadmin_name || 
      parsed?.superadmin_name ||
      parsed?.data?.name ||
      parsed?.name ||
      'Super Admin';

    this.loggedInUser = {
      name: superadminName,
      loginTime: new Date().toLocaleString()
    };

    
    this.timer = setInterval(() => {
      const now = new Date();
      this.loggedInUser!.loginTime = now.toLocaleString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
      });
    }, 1000);

    console.log('Parsed User:', parsed);
  }

  logout() {
    localStorage.removeItem('sa');
    localStorage.removeItem('sa_token');
    clearInterval(this.timer);
    this.router.navigate(['/SuperAdminLogin']);
  }

  confirmLogout() {
    this.logout();
  }
}
