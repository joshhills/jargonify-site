import { NgModule } from '@angular/core';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { AboutComponent } from 'about/about.component';

@NgModule({
  declarations: [
    AboutComponent
  ],
  imports: [
    LazyLoadImageModule
  ]
})
export class AboutModule { }
