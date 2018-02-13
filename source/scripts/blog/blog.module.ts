import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BlogComponent } from './blog.component';
import { BlogFeaturedComponent } from './blog-featured.component';
import { BlogItemComponent } from './blog-item.component';
import { BlogListComponent } from './blog-list.component';
import { BlogPaginationComponent } from './blog-pagination.component';
import { BlogSearchComponent } from 'blog/blog-search.component';

@NgModule({
  declarations: [
    BlogComponent,
    BlogFeaturedComponent,
    BlogItemComponent,
    BlogListComponent,
    BlogPaginationComponent,
    BlogSearchComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    BlogItemComponent
  ]
})
export class BlogModule { }
