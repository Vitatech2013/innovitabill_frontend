import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [RouterOutlet,RouterLink],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.css'
})
export class UserViewComponent implements OnInit{
  constructor (private router:Router){}
  ngOnInit(): void {
    
  }
   logout() {
    localStorage.removeItem('users');
    localStorage.removeItem('us_token')
    this.router.navigateByUrl('userlogin');
  }

}
