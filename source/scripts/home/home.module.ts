import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { HomeComponent } from './home.component';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    RouterModule,
    LazyLoadImageModule
  ]
})
export class HomeModule { }
