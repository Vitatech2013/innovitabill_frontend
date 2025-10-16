import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DemoModalboxComponent } from './demo-modalbox/demo-modalbox.component';

export const routes: Routes = [
    {path:'', component:HomeComponent},
    {path:'demo_modalbox', component:DemoModalboxComponent}
];
