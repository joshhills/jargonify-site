import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { PortfolioComponent } from '../portfolio/portfolio.component';
import { BlogModule } from '../blog/blog.module';
import { ImageCarouselComponent } from '../shared/components/image-carousel.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    PortfolioComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    LazyLoadImageModule,
    BlogModule,
    SharedModule
  ]
})
export class PortfolioModule {}
