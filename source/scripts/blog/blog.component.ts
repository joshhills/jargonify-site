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
  inSearchView: boolean = false;

  constructor(
    private appConfiguration: AppConfiguration,
    private postService: PostService
  ) {}

  ngOnInit() {
    this.postService.getBlogPosts(
      this.currentPage
    ).subscribe(
      res => {
        this.blogPosts = res;
      }
    );

    this.postService.getFeaturedBlogPosts(0, 1).subscribe(
      res => {
        this.featuredBlogPost = res[0];
        this.excludedPostIds = [this.featuredBlogPost.id];
      }
    );
  }
}