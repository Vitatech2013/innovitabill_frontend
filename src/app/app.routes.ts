import { Routes } from '@angular/router';
import { SuperAdminLoginComponent } from './super-admin-login/super-admin-login.component';
import { SuperadminViewComponent } from './superadmin-view/superadmin-view.component';
import { BusinessListComponent } from './business-list/business-list.component';
import { AdminsComponent } from './admins/admins.component';
import { RolesComponent } from './roles/roles.component';
import { CashiersComponent } from './cashiers/cashiers.component';
import { ManagersComponent } from './managers/managers.component';
import { BusinessLoginComponent } from './business-login/business-login.component';
import { BusinessDashboardComponent } from './business-dashboard/business-dashboard.component';
import { BusinessRegisterComponent } from './business-register/business-register.component';
import { UsersComponent } from './users/users.component';
import { HomeComponent } from './home/home.component';
import { CashierLoginComponent } from './cashier-login/cashier-login.component';
<<<<<<< HEAD
import { CategoriesComponent } from './categories/categories.component';
import { UnitsComponent } from './units/units.component';
import { ItemsComponent } from './items/items.component';
=======
import { AddBusinessComponent } from './add-business/add-business.component';
>>>>>>> f75029af8a891d60dfeb82945ffac0b8e2f1bb2d

export const routes: Routes = [
    {path:'SuperAdminLogin',component:SuperAdminLoginComponent},
    {path:'SuperAdminView',component:SuperadminViewComponent,children:[
        {path:'',component:BusinessListComponent},
        {path:'Business',component:BusinessListComponent},
<<<<<<< HEAD
        
=======
        {path:"add_business", component:AddBusinessComponent},
        {path:'admins',component:AdminsComponent},
        {path:'roles',component:RolesComponent},
        {path:'cashiers',component:CashiersComponent},
        {path:'managers',component:ManagersComponent},
>>>>>>> f75029af8a891d60dfeb82945ffac0b8e2f1bb2d
    ]},
    {path: 'businesslogin',component:BusinessLoginComponent},
    {path: 'businessRegister',component:BusinessRegisterComponent},
    {path: 'business-Dashboard',component:BusinessDashboardComponent, children:[
        {path:'',component:UsersComponent},
        {path: 'users', component:UsersComponent},
        {path:'categories',component:CategoriesComponent},
        {path:'roles',component:RolesComponent},
        {path:'units',component:UnitsComponent},
        
    ]},
    {path:'', component:HomeComponent},
    {path:'home',component:HomeComponent},
    {path:'cashier_login', component:CashierLoginComponent}
    
]
   





