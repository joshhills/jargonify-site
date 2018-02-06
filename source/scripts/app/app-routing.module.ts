import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components necessary for redirection.
import { BlogComponent } from 'blog/blog.component';
import { BlurbComponent } from 'blurb/blurb.component';
import { ErrorComponent } from 'error/error.component';
import { HomeComponent } from 'home/home.component';
import { PatternComponent } from 'pattern/pattern.component';
import { PortfolioComponent } from 'portfolio/portfolio.component';
import { PostComponent } from 'post/post.component';

// Define routes in greedy order of precedence.
const appRoutes: Routes = [
    {
      path: 'blog/:page',
      component: BlogComponent
    },
    {
      path: 'blurb',
      component: BlurbComponent
    },
    {
      path: 'home',
      component: HomeComponent
    },
    {
      path: 'pattern',
      component: PatternComponent
    },
    {
      path: 'portfolio',
      component: PortfolioComponent
    },
    {
      path: 'post/:id',
      component: PostComponent
    },
    {
      path: '',
      component: HomeComponent
    },
    {
      path: '**',
      component: ErrorComponent
    }
  ];

  @NgModule({
    imports: [
      RouterModule.forRoot(
        appRoutes
      )
    ],
    exports: [
      RouterModule
    ]
  })
  export class AppRoutingModule {}