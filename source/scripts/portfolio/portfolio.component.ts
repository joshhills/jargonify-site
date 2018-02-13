import { Component, OnInit } from '@angular/core';
import { MockPostService } from 'shared/services/post.service';
import { BlogPost } from 'shared/models/blog-post';

@Component({
  selector: 'portfolio',
  templateUrl: '../../templates/portfolio/portfolio.component.html'
})
export class PortfolioComponent implements OnInit {
  private portfolioPosts: BlogPost[] = [];

  constructor(
    private postService: MockPostService
  ) {}

  ngOnInit() {
    this.postService.getBlogPosts(
      0,
      -1,
      false,
      true,
      ''
    ).subscribe(data => {
      this.portfolioPosts = data;
    });
  }
}