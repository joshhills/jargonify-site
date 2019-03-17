import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from 'ngx-clipboard';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { PostComponent } from './post.component';
import { BlogModule } from '../blog/blog.module';
import { ImageCarouselComponent } from '../shared/components/image-carousel.component';
import { PortfolioModule } from '../portfolio/portfolio.module';

@NgModule({
  declarations: [
    PostComponent
  ],
  imports: [
    CommonModule,
    ClipboardModule,
    RouterModule,
    LazyLoadImageModule,
    SharedModule,
    BlogModule,
    PortfolioModule
  ]
})
export class PostModule { }
