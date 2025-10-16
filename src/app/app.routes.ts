import { Routes } from '@angular/router';
import { SuperAdminLoginComponent } from './super-admin-login/super-admin-login.component';
import { SuperadminViewComponent } from './superadmin-view/superadmin-view.component';
import { BusinessListComponent } from './business-list/business-list.component';
import { AddBusinessComponent } from './add-business/add-business.component';

export const routes: Routes = [
    {path:'SuperAdminLogin',component:SuperAdminLoginComponent},
    {path:'SuperAdminView',component:SuperadminViewComponent,children:[
        {path:'',component:BusinessListComponent},
        {path:'Business',component:BusinessListComponent},
        {path:'AddBusiness',component:AddBusinessComponent},
    ]},
   
];
