import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { ErrorComponent } from './error.component';

@NgModule({
  declarations: [
    ErrorComponent
  ],
  imports: [
    LazyLoadImageModule
  ]
})
export class ErrorModule { }
