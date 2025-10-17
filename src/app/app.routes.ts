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
];
