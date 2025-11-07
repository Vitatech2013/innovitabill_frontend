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
import { CategoriesComponent } from './categories/categories.component';
import { UnitsComponent } from './units/units.component';
import { AddBusinessComponent } from './add-business/add-business.component';
import { SuperadminProfileComponent } from './superadmin-profile/superadmin-profile.component';


export const routes: Routes = [
    {path:'SuperAdminLogin',component:SuperAdminLoginComponent},
    {path:'SuperAdminView',component:SuperadminViewComponent,children:[
        {path:'',component:BusinessListComponent},
        {path:'view-business',component:BusinessListComponent,},
        {path:"add-business", component:AddBusinessComponent},
       {path: 'superadmin_profile', component:SuperadminProfileComponent},
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
   





