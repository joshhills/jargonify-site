import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { PortfolioComponent } from 'portfolio/portfolio.component';
import { BlogModule } from 'blog/blog.module';

@NgModule({
  declarations: [
    PortfolioComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    LazyLoadImageModule,
    BlogModule
  ]
})
export class PortfolioModule {}
