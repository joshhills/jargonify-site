import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { PostComponent } from './post.component';

@NgModule({
  declarations: [
    PostComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    LazyLoadImageModule
  ]
})
export class PostModule { }
