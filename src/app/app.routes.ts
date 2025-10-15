import { Routes } from '@angular/router';
import { BusinessLoginComponent } from './business-login/business-login.component';
import { BusinessDashboardComponent } from './business-dashboard/business-dashboard.component';

export const routes: Routes = [
    {path: 'businesslogin',component:BusinessLoginComponent},
    {path: 'business-Dashboard',component:BusinessDashboardComponent}
];
