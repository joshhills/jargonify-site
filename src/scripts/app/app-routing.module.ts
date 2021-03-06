import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MetaGuard, MetaModule } from '@ngx-meta/core';

// Components necessary for redirection.
import { AboutComponent } from '../about/about.component';
import { BlogComponent } from '../blog/blog.component';
import { ErrorComponent } from '../error/error.component';
import { HomeComponent } from '../home/home.component';
import { PatternComponent } from '../pattern/pattern.component';
import { PatternAtomsComponent } from '../pattern/pattern-atoms.component';
import { PatternBaseComponent } from '../pattern/pattern-base.component';
import { PatternOrganismsComponent } from '../pattern/pattern-organisms.component';
import { PatternLayoutsComponent } from '../pattern/pattern-layouts.component';
import { PatternMoleculesComponent } from '../pattern/pattern-molecules.component';
import { PortfolioComponent } from '../portfolio/portfolio.component';
import { PostComponent } from '../post/post.component';

// Define routes in greedy order of precedence.
// TODO: Constants in app.configuration
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
      path: 'home',
      component: HomeComponent,
      redirectTo: ''
    },
    {
      path: 'blog',
      component: BlogComponent,
      canActivate: [MetaGuard],
      data: {
        meta: {
          title: 'Jargonify - Blog',
          description: 'Design and technology blog by Josh Hills',
          image: 'https://jargonify.com/static/images/social/blog-preview.jpg',
          'og:image': 'https://jargonify.com/static/images/social/blog-preview.jpg',
          'twitter:image:src': 'https://jargonify.com/static/images/social/blog-preview.jpg'
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
          description: 'Design and technology blog by Josh Hills',
          image: 'https://jargonify.com/static/images/social/blog-preview.jpg',
          'og:image': 'https://jargonify.com/static/images/social/blog-preview.jpg',
          'twitter:image:src': 'https://jargonify.com/static/images/social/blog-preview.jpg'
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
    // {
    //   path: 'pattern', // TODO: Add no scrape here?
    //   component: PatternComponent,
    //   children: [
    //     {
    //       path: 'base',
    //       component: PatternBaseComponent
    //     },
    //     {
    //       path: 'atoms',
    //       component: PatternAtomsComponent
    //     },
    //     {
    //       path: 'components',
    //       component: PatternOrganismsComponent
    //     },
    //     {
    //       path: 'molecules',
    //       component: PatternMoleculesComponent
    //     },
    //     {
    //       path: 'layouts',
    //       component: PatternLayoutsComponent
    //     }
    //   ],
    //   canActivate: [MetaGuard],
    //   data: {
    //     meta: {
    //       title: 'Jargonify - Pattern Library',
    //       description: 'Atomic design styles for the site'
    //     }
    //   }
    // },
    {
      path: 'portfolio',
      component: PortfolioComponent,
      canActivate: [MetaGuard],
      data: {
        meta: {
          title: 'Jargonify - Portfolio',
          description: 'Professional tech portfolio by Josh Hills',
          image: 'https://jargonify.com/static/images/social/portfolio-preview.jpg',
          'og:image': 'https://jargonify.com/static/images/social/portfolio-preview.jpg',
          'twitter:image:src': '/static/images/social/portfolio-preview.jpg'
        }
      }
    },
    {
      path: 'portfolio/:id',
      component: PortfolioComponent,
      canActivate: [MetaGuard],
      data: {
        meta: {
          title: 'Jargonify - Portfolio',
          description: 'Professional tech portfolio by Josh Hills',
          image: 'https://jargonify.com/static/images/social/portfolio-preview.jpg',
          'og:image': 'https://jargonify.com/static/images/social/portfolio-preview.jpg',
          'twitter:image:src': 'https://jargonify.com/static/images/social/portfolio-preview.jpg'
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
          image: 'https://jargonify.com/static/images/social/blog-preview.jpg',
          'og:image': 'https://jargonify.com/static/images/social/blog-preview.jpg',
          'twitter:image:src': 'https://jargonify.com/static/images/social/blog-preview.jpg',
          'og:type': 'article',
          'article:section': 'Technology',
          'article:author': 'Josh Hills'
        }
      }
    },
    {
      path: 'post/:id/:slug',
      component: PostComponent,
      canActivate: [MetaGuard],
      data: {
        meta: {
          title: 'Jargonify - Blog Post',
          description: 'Blog post by Josh Hills',
          image: 'https://jargonify.com/static/images/social/blog-preview.jpg',
          'og:image': 'https://jargonify.com/static/images/social/blog-preview.jpg',
          'twitter:image:src': 'https://jargonify.com/static/images/social/blog-preview.jpg',
          'og:type': 'article',
          'article:section': 'Technology',
          'article:author': 'Josh Hills'
        }
      }
    },
    {
      path: 'error',
      component: ErrorComponent
    },
    {
      path: '**',
      redirectTo: '/error'
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
