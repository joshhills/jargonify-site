import { Component, OnInit } from '@angular/core';
import { MockPostService } from 'shared/services/post.service';
import { PostType } from 'shared/models/post';
import { PortfolioLayoutPost, PortfolioSectionType } from 'shared/models/portfolio-layout-post';

@Component({
  selector: 'portfolio',
  templateUrl: '../../templates/portfolio/portfolio.component.html'
})
export class PortfolioComponent implements OnInit {
  private PortfolioSectionType: any = PortfolioSectionType;
  private PostType: any = PostType;
  private layout: PortfolioLayoutPost;

  constructor(
    private postService: MockPostService
  ) {}

  ngOnInit() {
    this.postService.getPortfolioLayout(
      'default'
    ).subscribe(data => {
      this.layout = data[0];
    });
  }
}