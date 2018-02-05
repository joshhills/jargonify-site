import { Component, OnInit } from '@angular/core';
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
  blogPosts: BlogPost[] = [];

  constructor(private postService: PostService) {}

  ngOnInit() {
    // this.blogPosts 
  }
}