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

import { BusinessForgotpasswordComponent } from './business-forgotpassword/business-forgotpassword.component';
import { BusinessOtpComponent } from './business-otp/business-otp.component';
import { SubCategoriesComponent } from './sub-categories/sub-categories.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AddBusinessTypeComponent } from './add-business-type/add-business-type.component';
import { ViewBusinessTypeComponent } from './view-business-type/view-business-type.component';



import { QuotationComponent } from './quotation/quotation.component';
import { UserForgotPasswordComponent } from './user-forgot-password/user-forgot-password.component';
import { UserResetPasswordComponent } from './user-reset-password/user-reset-password.component';


export const routes: Routes = [
  { path: 'SuperAdminLogin', component: SuperAdminLoginComponent },
   {path: 'forgot-password', component: ForgotPasswordComponent},
   {path: 'reset-password/:token', component: ResetPasswordComponent},
  {
    path: 'SuperAdminView',
    component: SuperadminViewComponent,
    children: [
      { path: '', component: BusinessListComponent },
      { path: 'view-business', component: BusinessListComponent },
      { path: 'add-business', component: AddBusinessComponent },
      { path: 'superadmin-profile', component: SuperadminProfileComponent },
      {path: 'add_business_type', component: AddBusinessTypeComponent},
      {path: 'view_business_type', component: ViewBusinessTypeComponent}
      
    ],
  },

  { path: 'userlogin', component: UserLoginComponent },
  {path:'userforgotpassword',component:UserForgotPasswordComponent},
  {path:'userresetpassword', component:UserResetPasswordComponent},

  {
    path: 'userview',
    component: UserViewComponent,
    children: [
      { path: '', component: SaleComponent },
      { path: 'userprofile', component: UserProfileComponent },
      {
        path: 'itemlist',
        component: ItemListComponent,
      },
      { path: 'items', component: ItemsComponent },

      {
        path: 'saleslist',
        component: SalesComponent,
      },
      { path: 'salereports', component: SaleReportsComponent },
      {
        path: 'sale',
        component: SaleComponent,
      },
      { path: 'quotation', component: QuotationComponent },
    ],
  },

  { path: 'businesslogin', component: BusinessLoginComponent },
  {path: 'business-Forgotpassword',component: BusinessForgotpasswordComponent},
  {path: 'business-otp', component: BusinessOtpComponent},
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
      { path: 'sub-categories', component: SubCategoriesComponent },
      { path: 'businessprofile', component: BusinessprofileComponent },
    ],
  },

  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'cashier_login', component: CashierLoginComponent },
];
