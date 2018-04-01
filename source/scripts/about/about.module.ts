import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { AboutComponent } from 'about/about.component';
import { ContactComponent } from 'about/contact.component';

@NgModule({
  declarations: [
    AboutComponent,
    ContactComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    LazyLoadImageModule
  ]
})
export class AboutModule { }
