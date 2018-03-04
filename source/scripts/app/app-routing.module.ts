import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MetaGuard, MetaModule } from '@ngx-meta/core';

// Components necessary for redirection.
import { AboutComponent } from 'about/about.component';
import { BlogComponent } from 'blog/blog.component';
import { ErrorComponent } from 'error/error.component';
import { HomeComponent } from 'home/home.component';
import { PatternComponent } from 'pattern/pattern.component';
import { PatternAtomsComponent } from 'pattern/pattern-atoms.component';
import { PatternBaseComponent } from 'pattern/pattern-base.component';
import { PatternOrganismsComponent } from 'pattern/pattern-organisms.component';
import { PatternLayoutsComponent } from 'pattern/pattern-layouts.component';
import { PatternMoleculesComponent } from 'pattern/pattern-molecules.component';
import { PortfolioComponent } from 'portfolio/portfolio.component';
import { PostComponent } from 'post/post.component';

// Define routes in greedy order of precedence.
// TODO: Add more changes to og properties per-page.
const appRoutes: Routes = [
    {
      path: '',
      component: HomeComponent,
      canActivate: [MetaGuard],
      data: {
        meta: {
          title: 'Jargonify',
          description: 'Design and technology by Josh Hills'
        }
      }
    },
    {
      path: 'blog',
      component: BlogComponent,
      canActivate: [MetaGuard],
      data: {
        meta: {
          title: 'Jargonify - Blog',
          description: 'Personal tech blog by Josh Hills',
          'og:image': '/images/social/blog-preview.jpg'
        }
      }
    },
    {
      path: 'blog/:page',
      component: BlogComponent,
      canActivate: [MetaGuard],
      data: {
        meta: {
          title: 'Jargonify - Blog', // TODO: Incorporate page number
          description: 'Personal tech blog by Josh Hills',
          'og:image': '/images/social/blog-preview.jpg'
        }
      }
    },
    {
      path: 'about',
      component: AboutComponent,
      canActivate: [MetaGuard],
      data: {
        meta: {
          title: 'Jargonify - Contact',
          description: 'Contact me'
        }
      }
    },
    {
      path: 'pattern', // TODO: Add no scrape here?
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
          component: PatternOrganismsComponent
        },
        {
          path: 'molecules',
          component: PatternMoleculesComponent
        },
        {
          path: 'layouts',
          component: PatternLayoutsComponent
        }
      ],
      canActivate: [MetaGuard],
      data: {
        meta: {
          title: 'Jargonify - Pattern Library',
          description: 'Atomic design styles for the site'
        }
      }
    },
    {
      path: 'portfolio',
      component: PortfolioComponent,
      canActivate: [MetaGuard],
      data: {
        meta: {
          title: 'Jargonify - Portfolio',
          description: 'Personal tech portfolio by Josh Hills',
          'og:image': '/images/social/portfolio-preview.jpg'
        }
      }
    },
    {
      path: 'post/:id',
      component: PostComponent,
      canActivate: [MetaGuard],
      data: {
        meta: {
          title: 'Jargonify - Blog Post',
          description: 'Blog post by Josh Hills',
          'og:image': '/images/social/blog-preview.jpg',
          'og:type': 'article'
          /*
            TODO: Add
            <meta name="article:section" content="Technology">
            <meta name="article:published_time" content="time">
            <meta name="article:modified_time" content="time">
          */
        }
      }
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
      ),
      MetaModule.forRoot()
    ],
    exports: [
      RouterModule
    ]
  })
  export class AppRoutingModule {}