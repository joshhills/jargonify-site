import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppConfiguration } from 'app/app.configuration';
import { MockPostService } from 'shared/services/post.service';
import { BlogPost } from 'shared/models/blog-post';

@Component({
  selector: 'blog',
  templateUrl: '../../templates/blog/blog.component.html',
  providers: [
    MockPostService
  ]
})
export class BlogComponent implements OnInit {
  private routeParamsSub: any;

  featuredBlogPost: BlogPost;
  blogPosts: BlogPost[];
  excludedPostIds: string[] = [];

  currentPage: number = 0;
  numPages: number = 1;
  inSearch: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private appConfiguration: AppConfiguration,
    private postService: MockPostService
  ) {}

  ngOnInit() {
    // Subscribe to changes to the route parameter 'page'.
    this.routeParamsSub = this.route.params.subscribe(
      params => {
        if (params['page']) {
          this.currentPage = +params['page'] - 1;
        }
      }
    );

    // Blog post meta.
    this.postService.getNumBlogPosts().subscribe(
      res => this.numPages = Math.floor((res - 1) / this.appConfiguration.MAX_BLOG_POSTS_PER_PAGE)
    );

    // Blog posts.
    this.postService.getBlogPosts(
      this.currentPage,
      this.appConfiguration.MAX_BLOG_POSTS_PER_PAGE + 1
    ).subscribe(
      res => this.blogPosts = res
    );

    // Featured blog posts.
    this.postService.getBlogPosts(
      this.currentPage,
      this.appConfiguration.MAX_BLOG_POSTS_PER_PAGE + 1,
      true
    ).subscribe(
      res => {
        this.featuredBlogPost = res[0];
        this.excludedPostIds = [this.featuredBlogPost.id];
      }
    );
  }

  onSearchTermChangedEvent(term: string) {
    this.inSearch = term.trim().length > 0;
    if (this.inSearch) {
      // Get blog posts with search term.
      this.postService.getBlogPosts(
        0,
        this.appConfiguration.MAX_BLOG_POSTS_PER_PAGE + 1,
        false,
        term
      ).subscribe(
        res => this.blogPosts = res
      );
    } else {
      // Get blog posts with search term.
      this.postService.getBlogPosts(
        0,
        this.appConfiguration.MAX_BLOG_POSTS_PER_PAGE + 1,
        false,
        term
    }

  }
}