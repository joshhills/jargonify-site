import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PortfolioComponent } from 'portfolio/portfolio.component';
import { BlogModule } from 'blog/blog.module';

@NgModule({
  declarations: [
    PortfolioComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    BlogModule
  ]
})
export class PortfolioModule {}
