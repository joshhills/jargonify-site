import { Component, OnInit } from '@angular/core';
import { WordpressAPIPostService } from 'shared/services/post.service';
import { PostType } from 'shared/models/post';
import { PortfolioLayoutPost, PortfolioSectionType } from 'shared/models/portfolio-layout-post';

@Component({
  selector: 'portfolio',
  templateUrl: '../../templates/portfolio/portfolio.component.html',
  providers: [
    WordpressAPIPostService
  ]
})
export class PortfolioComponent implements OnInit {
  private PortfolioSectionType: any = PortfolioSectionType;
  private PostType: any = PostType;
  layout: PortfolioLayoutPost;

  constructor(
    private postService: WordpressAPIPostService
  ) {}

  ngOnInit() {
    this.postService.getPortfolioLayout(
      '81' // TODO: Make this default?
    ).subscribe(data => {
      this.layout = data;
    });
  }
}