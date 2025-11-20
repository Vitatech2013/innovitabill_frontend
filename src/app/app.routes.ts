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
import { UserLoginComponent } from './user-login/user-login.component';
import { UserViewComponent } from './user-view/user-view.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemsComponent } from './items/items.component';
import { SalesComponent } from './sales-list/sales.component';
import { SaleComponent } from './sale/sale.component';
import { BusinessprofileComponent } from './businessprofile/businessprofile.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { SaleReportsComponent } from './sale-reports/sale-reports.component';

export const routes: Routes = [
  { path: 'SuperAdminLogin', component: SuperAdminLoginComponent },
  {
    path: 'SuperAdminView',
    component: SuperadminViewComponent,
    children: [
      { path: '', component: BusinessListComponent },
      { path: 'view-business', component: BusinessListComponent },
      { path: 'add-business', component: AddBusinessComponent },
      { path: 'superadmin_profile', component: SuperadminProfileComponent },
    ],
  },

  { path: 'userlogin', component: UserLoginComponent },
  {
    path: 'userview',
    component: UserViewComponent,
    children: [
      { path: '', component: SaleComponent },
      { path: 'userprofile', component: UserProfileComponent },
      {
        path: 'itemlist',
        component: ItemListComponent,
        children: [{ path: 'items', component: ItemsComponent }],
      },

      {
        path: 'saleslist',
        component: SalesComponent,
        children: [{ path: 'salereports', component: SaleReportsComponent }],
      },
      {
        path: 'sale',
        component: SaleComponent,
      },
    ],
  },

  { path: 'businesslogin', component: BusinessLoginComponent },
  { path: 'businessRegister', component: BusinessRegisterComponent },
  {
    path: 'business-Dashboard',
    component: BusinessDashboardComponent,
    children: [
      { path: '', component: UsersComponent },
      { path: 'users', component: UsersComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'units', component: UnitsComponent },
      { path: 'businessprofile', component: BusinessprofileComponent },
    ],
  },

  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'cashier_login', component: CashierLoginComponent },
];
