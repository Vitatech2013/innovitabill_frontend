import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BusinessService } from './Services/business.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'innovitabill_frontend';
  constructor(public businessService:BusinessService ) {}
}
