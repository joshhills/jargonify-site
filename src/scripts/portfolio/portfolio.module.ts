import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { PortfolioComponent } from '../portfolio/portfolio.component';
import { BlogModule } from '../blog/blog.module';
import { PortfolioCarouselComponent } from './portfolio-carousel.component';

@NgModule({
  declarations: [
    PortfolioComponent,
    PortfolioCarouselComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    LazyLoadImageModule,
    BlogModule
  ]
})
export class PortfolioModule {}
