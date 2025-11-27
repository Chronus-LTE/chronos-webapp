import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './components/home/home.component';
import { FeaturesPageComponent } from './components/features-page/features-page.component';
import { AboutPageComponent } from './components/about-page/about-page.component';

@NgModule({
  declarations: [
    LandingComponent,
    FeaturesPageComponent,
    AboutPageComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    LandingRoutingModule,
  ],
})
export class LandingModule { }

