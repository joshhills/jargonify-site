import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { WordpressAPIPostService } from 'shared/services/post.service';
import { HistoryService } from 'shared/services/history.service';
import { BlogPost } from 'shared/models/blog-post';
import { MetaService } from '@ngx-meta/core';

import 'rxjs/add/operator/filter';

@Component({
  selector: 'post',
  templateUrl: '../../templates/post/post.component.html',
  providers: [
    WordpressAPIPostService
  ]
})
export class PostComponent {
  post: BlogPost;

  // Control whether back navigation should be enabled.
  backEnabled: boolean = false;

  private routeParamsSub: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: WordpressAPIPostService,
    private location: Location,
    private historyService: HistoryService,
    private readonly meta: MetaService
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        if (params['id']) {
          this.getBlogPost(params['id']);
        }
      }
    );
    this.historyService.isNavigatedWithinApp().subscribe(
      res => {
        this.backEnabled = res;
      }
    );
  }

  ngOnDestroy() {
    this.meta.removeTag('property="article:published_time"');
    this.meta.removeTag('property="article:modified_time"');
    this.meta.removeTag('property="article:section"');
    this.meta.removeTag('property="article:author"');
    this.meta.removeTag('property="article:tag"');
  }

  getBlogPost(id: string): void {
    this.postService.getBlogPost(id).subscribe(
      res => {
        this.post = res;

        // Set meta tags from post.
        // Title overrides.
        let postTitle: string = 'Jargonify - Blog Post - ' + this.post.title;
        this.meta.setTitle(postTitle);
        this.meta.setTag('twitter:title', postTitle);

        // Description overrides.
        if (this.post.summary) {
          let p = document.createElement('p');
          p.innerHTML = this.post.summary;
          let summary: string = p.innerText;
          this.meta.setTag('description', summary);
          this.meta.setTag('twitter:description', summary);
        }

        // Image overrides.
        if (this.post.featureImage.urlMedium) {
          this.meta.setTag('og:image', this.post.featureImage.urlMedium);
          this.meta.setTag('twitter:image:src', this.post.featureImage.urlMedium);
        }

        // Additional new tags.
        this.meta.setTag('article:published_time', this.post.dateCreated);
        this.meta.setTag('article:modified_time', this.post.dateCreated);
        this.meta.setTag('article:tag', this.post.tags.join(' '));
      }
    );
  }

  back() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
        this.router.navigate(['/']);
    }
  }
}