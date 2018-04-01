import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppConfiguration } from 'app/app.configuration';
import { WordpressAPIPostService } from 'shared/services/post.service';
import { BlogPost } from 'shared/models/blog-post';
import { Observable } from 'rxjs/Observable';

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

  featuredBlogPost: BlogPost;
  blogPosts: BlogPost[] = [];
  excludedPostIds: string[] = [];

  currentPage: number = 0;
  numPosts: number = 0;
  numPages: number = 1;

  inSearch: boolean = false;
  searchTerm: string = '';

  noPostsAfterFetch: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appConfiguration: AppConfiguration,
    private postService: WordpressAPIPostService
  ) {}

  setPageProperties(data: any): void {
    this.currentPage = data['page'] ? +data['page'] - 1 : 0;
  }

  setSearchProperties(data: any): void {
    this.searchTerm = data['search'] ? data['search'] : '';
    this.inSearch = this.searchTerm.trim().length > 0;
  }

  fetchBlogPostProperties(): void {
    let numPosts = this.currentPage === 0
      ? this.appConfiguration.MAX_BLOG_POSTS_PER_PAGE + 1
      : this.appConfiguration.MAX_BLOG_POSTS_PER_PAGE;

    // Get the individual posts.
    this.postService.getBlogPosts(
      this.currentPage,
      this.appConfiguration.MAX_BLOG_POSTS_PER_PAGE + 1,
      false,
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
      false,
      this.searchTerm
    ).subscribe(data => {
      this.numPosts = data;
      this.numPages = Math.ceil((data - 1) // TODO: Might be incorrect due to featured.
        / (this.appConfiguration.MAX_BLOG_POSTS_PER_PAGE + 1));
    });
  }

  fetchFeaturedBlogPost(): void {
    // Determine featured blog post from current list.
    for (let post of this.blogPosts) {
      if (post.isFeature) {
        this.featuredBlogPost = post;
        this.excludedPostIds = [post.id];
        break;
      }
    }
  }

  ngOnInit() {
    Observable.combineLatest(
      this.route.params,
      this.route.queryParams
    ).subscribe(
      data => {
        this.setPageProperties(data[0]);
        this.setSearchProperties(data[1]);

        this.fetchBlogPostProperties();
      }
    );
  }

  onSearchTermChangedEvent(term: string): void {
    let navArray: any[] = ['/blog'];

    let navExtras: {} = {};

    if (term.trim().length > 0) {
      navExtras = {
        queryParams: {
          'search': term
        }
      };
    }

    this.router.navigate(navArray, navExtras);
  }
}