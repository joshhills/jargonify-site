import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppConfiguration } from '../app/app.configuration';
import { WordpressAPIPostService } from '../shared/services/post.service';
import { BlogPost } from '../shared/models/blog-post';
import { combineLatest } from 'rxjs';
import { WindowService } from '../shared/services/window.service';

@Component({
  selector: 'blog',
  templateUrl: '../../templates/blog/blog.component.html',
  providers: [
    WordpressAPIPostService
  ]
})
export class BlogComponent implements OnInit {
  private routeParamsSub: any;
  private queryParamsSub: any;

  @ViewChild('cover') cover: ElementRef;

  featuredBlogPost: BlogPost;
  blogPosts: BlogPost[] = [];
  excludedPostIds: string[] = [];

  currentPage = 0;
  numPosts = 0;
  numPages = 1;

  inSearch = false;
  searchTerm = '';

  noPostsAfterFetch = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appConfiguration: AppConfiguration,
    private postService: WordpressAPIPostService,
    private windowService: WindowService
  ) {}

  setPageProperties(data: any): void {
    this.currentPage = data['page'] ? +data['page'] - 1 : 0;
  }

  setSearchProperties(data: any): void {
    this.searchTerm = data['search'] ? data['search'] : '';
    this.inSearch = this.searchTerm.trim().length > 0;
  }

  fetchBlogPostProperties(): void {
    const numPosts = this.currentPage === 0
      ? this.appConfiguration.MAX_BLOG_POSTS_PER_PAGE + 1
      : this.appConfiguration.MAX_BLOG_POSTS_PER_PAGE;

    // Get the individual posts.
    this.postService.getBlogPosts(
      this.currentPage,
      this.appConfiguration.MAX_BLOG_POSTS_PER_PAGE + 1,
      this.searchTerm
    ).subscribe(data => {
      this.blogPosts = data;

      this.noPostsAfterFetch = this.blogPosts.length === 0;

      if (this.currentPage === 0) {
        this.fetchFeaturedBlogPost();
      }
    },
    err => {
      this.noPostsAfterFetch = true;
    });

    // Get the number of blog posts with this criteria.
    this.postService.getNumBlogPosts(
      this.searchTerm
    ).subscribe(data => {
      this.numPosts = data;
      this.numPages = Math.ceil((data - 1) // TODO: Might be incorrect due to featured.
        / (this.appConfiguration.MAX_BLOG_POSTS_PER_PAGE + 1));
    });
  }

  fetchFeaturedBlogPost(): void {
    // Determine featured blog post from current list.
    for (const post of this.blogPosts) {
      if (post.classification.isFeature) {
        this.featuredBlogPost = post;
        this.excludedPostIds = [post.id];
        break;
      }
    }
  }

  ngOnInit() {
    combineLatest(
      this.route.params,
      this.route.queryParams
    ).subscribe(
      data => {
        this.setPageProperties(data[0]);
        this.setSearchProperties(data[1]);

        if (this.currentPage === 0 && !this.inSearch) {
          this.scrollToTopOfPage();
        }

        this.fetchBlogPostProperties();
      }
    );
  }

  searchTermChangedEvent(term: string): void {
    const navArray: any[] = ['/blog'];

    let navExtras: {} = {};

    if (term.trim().length > 0) {
      navExtras = {
        queryParams: {
          search: term
        }
      };
    }

    this.router.navigate(navArray, navExtras);
  }

  scrollToTopOfPage(): void {
    this.windowService.getNativeWindow().scrollTo({top: 0, behavior: 'smooth', inline: 'nearest'});
    this.windowService.getNativeWindow().document.getElementById('bleed').scrollTo({top: 0, behavior: 'smooth', inline: 'nearest'});
  }
}
