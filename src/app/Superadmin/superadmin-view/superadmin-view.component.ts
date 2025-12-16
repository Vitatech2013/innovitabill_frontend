import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
declare var bootstrap: any;
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
  superadminName: any;
   toastMessage: string | null = null;
  toastType: 'success' | 'error' | 'warning' = 'success';


  constructor(private router: Router) {}

  ngOnInit(): void {
    const stored = localStorage.getItem('sa');
    console.log(stored, 'stored');
    if (!stored) {
      this.router.navigateByUrl('/SuperAdminLogin');
      return;
    }

    const parsed = JSON.parse(stored);
    console.log(parsed, 'parsed');

    this.superadminName = parsed.superadmin_name;
  // const nav = this.router.getCurrentNavigation();
  // const state = nav?.extras?.state as { toast?: string };

  // if (state?.toast) {
  //   this.showToast(state.toast, 'success');
  // }
  }
  //   showToast(message: string, type: 'success' | 'error' | 'warning') {
  //   this.toastMessage = message;
  //   this.toastType = type;
  //   setTimeout(() => (this.toastMessage = null), 2000);
  // }

  logout() {
    localStorage.removeItem('sa');
    localStorage.removeItem('sa_token');

    this.router.navigateByUrl('SuperAdminLogin');
  }
}
