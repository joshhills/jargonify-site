import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogComponent } from './blog.component';
import { BlogFeaturedComponent } from './blog-featured.component';
import { BlogSearchComponent } from 'blog/blog-search.component';

@NgModule({
  declarations: [
    BlogComponent,
    BlogFeaturedComponent,
    BlogSearchComponent
  ],
  imports: [
    CommonModule
  ]
})
export class BlogModule { }
