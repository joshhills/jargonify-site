import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { WordpressAPIPostService } from '../shared/services/post.service';
import { HistoryService } from '../shared/services/history.service';
import { BlogPost } from '../shared/models/blog-post';
import { MetaService } from '@ngx-meta/core';
import { CookieService } from 'ngx-cookie-service';
import { WindowService } from '../shared/services/window.service';
import { PostSectionType } from '../shared/models/post';

@Component({
  selector: 'post',
  templateUrl: '../../templates/post/post.component.html',
  providers: [
    WordpressAPIPostService
  ]
})
export class PostComponent implements OnInit, OnDestroy {
  @ViewChild('cover') cover: ElementRef;
  @ViewChild('pvideo') set ft(pvideo: ElementRef) {
    if (pvideo && pvideo.nativeElement.play) {
      pvideo.nativeElement.muted = true;
      pvideo.nativeElement.play().catch();
    }
  }

  private PostSectionType: any = PostSectionType;

  post: BlogPost;

  // Control whether back navigation should be enabled.
  backEnabled = false;
  copyMsg = 'Copy link';

  private routeParamsSub: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: WordpressAPIPostService,
    private location: Location,
    private historyService: HistoryService,
    private readonly meta: MetaService,
    private cookieService: CookieService,
    private windowService: WindowService
  ) {}

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

        // Set cookie.
        let visited: any[] = [];
        if (this.cookieService.get('visited')) {
          visited = JSON.parse(this.cookieService.get('visited'));
        }
        if (visited && visited.indexOf(this.post.id) === -1) {
          visited.push({id: this.post.id, date: Date.now()});
          this.cookieService.set('visited', JSON.stringify(visited));
        }

        // Set meta tags from post.
        // Title overrides.
        const postTitle: string = 'Jargonify - Blog Post - ' + this.post.title;
        this.meta.setTitle(postTitle);
        this.meta.setTag('twitter:title', postTitle);

        // Url
        this.meta.setTag('twitter:url', this.router.url);

        // Description overrides.
        if (this.post.summary) {
          const summary: string = this.post.summary.replace(/(&nbsp;|<([^>]+)>)/ig, '').replace(/(\r\n|\n|\r)/gm, '');
          this.meta.setTag('description', summary);
          this.meta.setTag('og:description', summary);
          this.meta.setTag('twitter:description', summary);
        } // TODO: Else snip from content?..

        // Media overrides.
        if (this.post.featuredVideo.mp4 || this.post.featuredVideo.webm) {
          this.meta.setTag('twitter:card', 'player');
          if (this.post.featuredVideo.mp4.url) {
            this.meta.setTag('og:video', this.post.featuredVideo.mp4.url);
            this.meta.setTag('twitter:player', this.post.featuredVideo.mp4.url);
            this.meta.setTag('twitter:player:width', this.post.featuredVideo.mp4.width.toString());
            this.meta.setTag('twitter:player:height', this.post.featuredVideo.mp4.height.toString());
          } else {
            this.meta.setTag('og:video', this.post.featuredVideo.webm.url);
            this.meta.setTag('twitter:player', this.post.featuredVideo.webm.url);
            this.meta.setTag('twitter:player:width', this.post.featuredVideo.webm.width.toString());
            this.meta.setTag('twitter:player:height', this.post.featuredVideo.webm.height.toString());
          }
        }

        if (this.post.featureImage.urlFull) {
          this.meta.setTag('image', this.post.featureImage.urlFull);
          this.meta.setTag('og:image', this.post.featureImage.urlFull);
          if (this.post.featureImage.altText) {
            this.meta.setTag('og:image:alt', this.post.featureImage.altText);
          }
          this.meta.setTag('twitter:image:src', this.post.featureImage.urlFull);
        }

        // Additional new tags.
        this.meta.setTag('article:section', this.post.categories[0].name);
        this.meta.setTag('article:published_time', this.post.dateCreated);
        this.meta.setTag('article:modified_time', this.post.dateCreated);
        const tagNames: string[] = [];
        for (const tag of this.post.tags) {
          tagNames.push(tag.name);
        }
        this.meta.setTag('article:tag', tagNames.join(' '));
      },
      err => {
        this.router.navigate(['/error']);
      }
    );
  }

  scrollToTop(): boolean {
    (this.cover.nativeElement).scrollIntoView({behavior: 'smooth', block: 'start'});
    return false;
  }

  back(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/']);
    }
  }
}
