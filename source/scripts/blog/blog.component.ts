import { Component, OnInit } from '@angular/core';
import { AppConfiguration } from 'app/app.configuration';
import { PostService } from 'shared/services/post.service';
import { BlogPost } from 'shared/models/blog-post';

@Component({
  selector: 'blog',
  templateUrl: '../../templates/blog/blog.component.html',
  providers: [
    PostService
  ]
})
export class BlogComponent implements OnInit {
  featuredBlogPost: BlogPost;
  blogPosts: BlogPost[];
  excludedPostIds: string[] = [];

  currentPage: number = 0;
  numPages: number = 1;
  inSearchView: boolean = false;

  constructor(
    private appConfiguration: AppConfiguration,
    private postService: PostService
  ) {}

  ngOnInit() {
    // Blog post meta.
    this.numPages = Math.floor(
      (this.postService.getNumBlogPosts() - 1)
        / this.appConfiguration.MAX_BLOG_POSTS_PER_PAGE
    );

    // Blog posts.
    this.postService.getBlogPosts(
      this.currentPage,
      this.appConfiguration.MAX_BLOG_POSTS_PER_PAGE + 1
    ).subscribe(
      res => {
        this.blogPosts = res;
      }
    );

    // Featured blog posts.
    this.postService.getFeaturedBlogPosts(0, 1).subscribe(
      res => {
        this.featuredBlogPost = res[0];
        this.excludedPostIds = [this.featuredBlogPost.id];
      }
    );
  }
}