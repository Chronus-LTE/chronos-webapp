import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/home/home.component';
import { FeaturesPageComponent } from './components/features-page/features-page.component';
import { AboutPageComponent } from './components/about-page/about-page.component';
import { LoadingGuard } from './guards/loading.guard';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    canActivate: [LoadingGuard],
  },
  {
    path: 'features',
    component: FeaturesPageComponent,
    canActivate: [LoadingGuard],
  },
  {
    path: 'about',
    component: AboutPageComponent,
    canActivate: [LoadingGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingRoutingModule { }