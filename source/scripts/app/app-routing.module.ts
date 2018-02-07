import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components necessary for redirection.
import { BlogComponent } from 'blog/blog.component';
import { BlurbComponent } from 'blurb/blurb.component';
import { ErrorComponent } from 'error/error.component';
import { HomeComponent } from 'home/home.component';
import { PatternComponent } from 'pattern/pattern.component';
import { PatternAtomsComponent } from 'pattern/pattern-atoms.component';
import { PatternBaseComponent } from 'pattern/pattern-base.component';
import { PatternComponentsComponent } from 'pattern/pattern-components.component';
import { PatternLayoutsComponent } from 'pattern/pattern-layouts.component';
import { PatternMoleculesComponent } from 'pattern/pattern-molecules.component';
import { PortfolioComponent } from 'portfolio/portfolio.component';
import { PostComponent } from 'post/post.component';

// Define routes in greedy order of precedence.
const appRoutes: Routes = [
    {
      path: 'blog',
      component: BlogComponent
    },
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
      component: PatternComponent,
      children: [
        {
          path: 'base',
          component: PatternBaseComponent
        },
        {
          path: 'atoms',
          component: PatternAtomsComponent
        },
        {
          path: 'components',
          component: PatternComponentsComponent
        },
        {
          path: 'molecules',
          component: PatternMoleculesComponent
        },
        {
          path: 'layouts',
          component: PatternLayoutsComponent
        }
      ]
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