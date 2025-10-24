import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CashierLoginComponent } from './cashier-login/cashier-login.component';


export const routes: Routes = [
    {path:'', component:HomeComponent},
    {path:'cashier_login', component:CashierLoginComponent}
    
];
