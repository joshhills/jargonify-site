import { Component, OnInit } from '@angular/core';
import { MockPostService } from 'shared/services/post.service';
import { PortfolioLayoutPost } from 'shared/models/portfolio-layout-post';

@Component({
  selector: 'portfolio',
  templateUrl: '../../templates/portfolio/portfolio.component.html'
})
export class PortfolioComponent implements OnInit {
  private layout: PortfolioLayoutPost;

  constructor(
    private postService: MockPostService
  ) {}

  ngOnInit() {
    this.postService.getPortfolioLayout(
      'default'
    ).subscribe(data => {
      this.layout = data;
    });
  }
}