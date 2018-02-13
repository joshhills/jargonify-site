import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppConfiguration } from 'app/app.configuration';
import { MockPostService } from 'shared/services/post.service';
import { BlogPost } from 'shared/models/blog-post';
import { Observable } from '../../../configuration/node_modules/rxjs/Observable';

@Component({
  selector: 'blog',
  templateUrl: '../../templates/blog/blog.component.html',
  providers: [
    MockPostService
  ]
})
export class BlogComponent implements OnInit {
  private routeParamsSub: any;
  private queryParamsSub: any;

  featuredBlogPost: BlogPost;
  blogPosts: BlogPost[];
  excludedPostIds: string[] = [];

  currentPage: number = 0;
  numPages: number = 1;

  inSearch: boolean = false;
  searchTerm: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appConfiguration: AppConfiguration,
    private postService: MockPostService
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
      numPosts,
      false,
      false,
      this.searchTerm
    ).subscribe(data => this.blogPosts = data);

    // Get the number of blog posts with this criteria.
    this.postService.getNumBlogPosts(
      false,
      this.searchTerm
    ).subscribe(data => {
      this.numPages = Math.ceil((data - 1) // TODO: Might be incorrect due to featured.
        / (this.appConfiguration.MAX_BLOG_POSTS_PER_PAGE + 1));
    });
  }

  fetchFeaturedBlogPost(): void {
    // Featured blog posts.
    this.postService.getBlogPosts(
      0,
      1,
      true
    ).subscribe(data => {
      this.featuredBlogPost = data[0];
      this.excludedPostIds = [this.featuredBlogPost.id];
    });
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
        this.fetchFeaturedBlogPost();
      }
    );
  }

  onSearchTermChangedEvent(term: string): void {
    // let navArray: any[]
    //   = this.currentPage === 0 ? ['/blog'] : ['/blog', this.currentPage + 1];

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