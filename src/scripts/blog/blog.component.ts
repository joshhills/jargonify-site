import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppConfiguration } from '../app/app.configuration';
import { WordpressAPIPostService } from '../shared/services/post.service';
import { BlogPost } from '../shared/models/blog-post';
import { combineLatest, Subscription, Observable, forkJoin } from 'rxjs';
import { WindowService } from '../shared/services/window.service';
import { Tag } from '../shared/models/tag';
import { Category } from '../shared/models/category';

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
  tag: any = '';
  category = '';

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
    this.tag = data['tag'] ? data['tag'] : '';
    this.category = data['category'] ? data['category'] : '';
    this.inSearch = this.searchTerm.trim().length > 0 || this.tag !== '' || this.category !== '';
  }

  fetchBlogPostProperties(): void {
    const numPosts = this.currentPage === 0
      ? this.appConfiguration.MAX_BLOG_POSTS_PER_PAGE + 1
      : this.appConfiguration.MAX_BLOG_POSTS_PER_PAGE;

    // Get the number of blog posts with this criteria.
    this.postService.getNumBlogPosts(
      this.searchTerm,
      [this.tag],
      [this.category]
    ).subscribe(data => {
      this.numPosts = data;
      this.numPages = Math.ceil((data - 1) // TODO: Might be incorrect due to featured.
        / (this.appConfiguration.MAX_BLOG_POSTS_PER_PAGE + 1));
    });

    // Get the individual posts.
    this.postService.getBlogPosts(
      this.currentPage,
      this.appConfiguration.MAX_BLOG_POSTS_PER_PAGE + 1,
      this.searchTerm,
      [this.tag],
      [this.category]
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

        const tagAndCategoryOperations: any[] = [];

        if (this.tag !== '' && isNaN(parseInt(this.tag, 10))) {
          tagAndCategoryOperations.push(this.postService.getTag(this.tag));
        }

        if (this.category !== '' && isNaN(parseInt(this.category, 10))) {
          tagAndCategoryOperations.push(this.postService.getCategory(this.category));
        }

        if (tagAndCategoryOperations.length > 0) {
          forkJoin(tagAndCategoryOperations).subscribe((d) => {
            for (const response of d) {
              if (response instanceof Tag) {
                this.tag = response.id;
              }
              if (response instanceof Category) {
                this.category = response.id;
              }
            }

            if (this.tag !== '' && isNaN(parseInt(this.tag, 10))
            || this.category !== '' && isNaN(parseInt(this.category, 10))) {
              console.log('shouldn');
              this.numPosts = 0;
              this.noPostsAfterFetch = true;
              this.numPages = 0;
              return;
            }

            this.fetchBlogPostProperties();
          });
        } else {
          this.fetchBlogPostProperties();
        }
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
