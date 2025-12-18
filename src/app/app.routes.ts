import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { UserResetPasswordComponent } from './User/user-reset-password/user-reset-password.component';
import { UserForgotPasswordComponent } from './User/user-forgot-password/user-forgot-password.component';
import { SuperadminProfileComponent } from './Superadmin/superadmin-profile/superadmin-profile.component';
import { UserLoginComponent } from './User/user-login/user-login.component';
import { UserViewComponent } from './User/user-view/user-view.component';
import { UserProfileComponent } from './User/user-profile/user-profile.component';
import { SuperadminViewComponent } from './Superadmin/superadmin-view/superadmin-view.component';
import { UsersComponent } from './Business/users/users.component';
import { SuperAdminLoginComponent } from './Superadmin/super-admin-login/super-admin-login.component';
import { ForgotPasswordComponent } from './Superadmin/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './Superadmin/reset-password/reset-password.component';
import { BusinessListComponent } from './Superadmin/business-list/business-list.component';
import { AddBusinessComponent } from './Superadmin/add-business/add-business.component';
import { AddBusinessTypeComponent } from './Superadmin/add-business-type/add-business-type.component';
import { ViewBusinessTypeComponent } from './Superadmin/view-business-type/view-business-type.component';
import { SaleComponent } from './User/create-sale/sale.component';
import { ItemListComponent } from './User/item-list/item-list.component';
import { ItemsComponent } from './User/add-items/items.component';
import { SalesComponent } from './User/sales-list/sales.component';
import { SaleReportsComponent } from './User/sale-reports/sale-reports.component';
import { QuotationComponent } from './User/quotation/quotation.component';
import { BusinessLoginComponent } from './Business/business-login/business-login.component';
import { BusinessForgotpasswordComponent } from './Business/business-forgotpassword/business-forgotpassword.component';
import { BusinessOtpComponent } from './Business/business-otp/business-otp.component';
import { BusinessDashboardComponent } from './Business/business-dashboard/business-dashboard.component';
import { BusinessprofileComponent } from './Business/businessprofile/businessprofile.component';
import { CategoriesComponent } from './Business/categories/categories.component';
import { RolesComponent } from './Business/roles/roles.component';
import { UnitsComponent } from './Business/units/units.component';
import { SubCategoriesComponent } from './Business/sub-categories/sub-categories.component';
import { InactiveBusinesstypeComponent } from './Superadmin/inactive-businesstype/inactive-businesstype.component';
import { UserDashboardComponent } from './User/user-dashboard/user-dashboard.component';
import { CreatePurchaseComponent } from './User/create-purchase/create-purchase.component';
import { PurchaseListComponent } from './User/purchase-list/purchase-list.component';


export const routes: Routes = [
  { path: 'SuperAdminLogin', component: SuperAdminLoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  {
    path: 'SuperAdminView',
    component: SuperadminViewComponent,
    children: [
      { path: '', component: BusinessListComponent },
      { path: 'view-business', component: BusinessListComponent },
      { path: 'add-business', component: AddBusinessComponent },
      { path: 'superadmin-profile', component: SuperadminProfileComponent },
      { path: 'add_business_type', component: AddBusinessTypeComponent },
      { path: 'view_business_type', component: ViewBusinessTypeComponent },
      {path: 'inactive_businesstype', component: InactiveBusinesstypeComponent}
    ],
  },

  { path: 'userlogin', component: UserLoginComponent },
  {path:'userforgotpassword',component:UserForgotPasswordComponent},
  {path:'userresetpassword/:token', component:UserResetPasswordComponent},

  {
    path: 'userview',
    component: UserViewComponent,
    children: [
      {path:'', component:UserDashboardComponent},
      {path:'userdashboard',component:UserDashboardComponent},
      { path: 'createsale', component: SaleComponent },
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
      {path:'purchaselist',component:PurchaseListComponent},
      { path: 'salereports', component: SaleReportsComponent },
      {
        path: 'sale',
        component: SaleComponent,
      },
      { path: 'quotation', component: QuotationComponent },
      {path:'purchase',component:CreatePurchaseComponent}
    ],
  },

  { path: 'businesslogin', component: BusinessLoginComponent },
  {
    path: 'business-Forgotpassword',
    component: BusinessForgotpasswordComponent,
  },
  { path: 'business-otp', component: BusinessOtpComponent },

  {
    path: 'business-Dashboard',
    component: BusinessDashboardComponent,
    children: [
      { path: '', component: UsersComponent },
      { path: 'businessprofile', component: BusinessprofileComponent },
      { path: 'users', component: UsersComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'units', component: UnitsComponent },
      { path: 'sub-categories', component: SubCategoriesComponent },
    ],
  },

  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
];
