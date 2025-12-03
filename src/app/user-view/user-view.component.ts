import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [RouterOutlet, RouterLink,CommonModule,ReactiveFormsModule,FormsModule,RouterModule],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.css',
})
export class UserViewComponent implements OnInit {
  loggedInUser: { name: string; loginTime: string } | null = null;
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
      'User';

    this.loggedInUser = {
      name: userName,
      loginTime: new Date().toLocaleString(),
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
        hour12: true,
      });
    }, 1000);

    console.log('Parsed User:', parsed);
  }

  logout() {
    localStorage.removeItem('users');
    localStorage.removeItem('us_token');
    this.router.navigateByUrl('userlogin');
  }
}


