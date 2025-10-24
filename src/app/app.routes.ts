import { Routes } from '@angular/router';
import { BusinessLoginComponent } from './business-login/business-login.component';
import { BusinessDashboardComponent } from './business-dashboard/business-dashboard.component';
import { BusinessRegisterComponent } from './business-register/business-register.component';
import { UsersComponent } from './users/users.component';

export const routes: Routes = [
    {path: 'businesslogin',component:BusinessLoginComponent},
    {path: 'businessRegister',component:BusinessRegisterComponent},
    
    {path: 'business-Dashboard',component:BusinessDashboardComponent, children:[
        {path:'',component:UsersComponent},
        {path: 'users', component:UsersComponent}
    ]},
import { HomeComponent } from './home/home.component';
import { CashierLoginComponent } from './cashier-login/cashier-login.component';


export const routes: Routes = [
    {path:'', component:HomeComponent},
    {path:'cashier_login', component:CashierLoginComponent}
    
];
