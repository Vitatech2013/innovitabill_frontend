import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  Router,
  RouterLink,
  RouterModule,
  RouterOutlet,
} from '@angular/router';

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.css',
})
export class UserViewComponent implements OnInit {
  loggedInUser: { name: string; role:string } | null = null;
  timer: any;
  items: any;
  isCollapsed = false;
  isMobileMenu = false;
  darkMode = false;
  constructor(private router: Router) {}
  ngOnInit(): void {
    const stored = localStorage.getItem('users');

    if (!stored) {
      this.router.navigateByUrl('/userlogin');
      return;
    }
    const saved = localStorage.getItem('sidebarCollapsed');
    this.isCollapsed = saved === 'true';

    const theme = localStorage.getItem('darkMode');
    this.darkMode = theme === 'true';

    if (this.darkMode) document.body.classList.add('dark');

    const parsed = JSON.parse(stored);

    const userName =
      parsed?.data?.user_name ||
      parsed?.user_name ||
      parsed?.data?.name ||
      parsed?.name ||
      'User';
    const userRole =
      parsed?.data?.role_id?.role_name ||
      parsed?.role_id?.role_name ||
      parsed?.data?.role ||
      parsed?.role ||
      'Role';

    this.loggedInUser = {
      name: userName,
     
      role: userRole,
    };

   
    console.log('Parsed User:', parsed);
  }

  logout() {
    localStorage.removeItem('users');
    localStorage.removeItem('us_token');
    this.router.navigateByUrl('userlogin');
  }
  toggleSidebar() {
    // Mobile → open/close sidebar sliding menu
    if (window.innerWidth < 768) {
      this.isMobileMenu = !this.isMobileMenu;
      return;
    }

    this.isCollapsed = !this.isCollapsed;
    localStorage.setItem('sidebarCollapsed', this.isCollapsed.toString());
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('darkMode', this.darkMode.toString());

    if (this.darkMode) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }
}
