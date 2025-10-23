import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CashierComponent } from './cashier/cashier.component';


export const routes: Routes = [
    {path:'', component:HomeComponent},
    {path:'cashier', component:CashierComponent}
    
];
