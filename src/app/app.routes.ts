import { Routes } from '@angular/router';
import { SuperAdminLoginComponent } from './super-admin-login/super-admin-login.component';
import { SuperadminViewComponent } from './superadmin-view/superadmin-view.component';
import { BusinessListComponent } from './business-list/business-list.component';
import { AdminsComponent } from './admins/admins.component';
import { RolesComponent } from './roles/roles.component';
import { CashiersComponent } from './cashiers/cashiers.component';
import { ManagersComponent } from './managers/managers.component';

export const routes: Routes = [
    {path:'SuperAdminLogin',component:SuperAdminLoginComponent},
    {path:'SuperAdminView',component:SuperadminViewComponent,children:[
        {path:'',component:BusinessListComponent},
        {path:'Business',component:BusinessListComponent},
        {path:'admins',component:AdminsComponent},
        {path:'roles',component:RolesComponent},
        {path:'cashiers',component:CashiersComponent},
        {path:'managers',component:ManagersComponent},
    ]},
   
import { HomeComponent } from './home/home.component';
import { DemoModalboxComponent } from './demo-modalbox/demo-modalbox.component';

export const routes: Routes = [
    {path:'', component:HomeComponent},
    {path:'demo_modalbox', component:DemoModalboxComponent}
];
