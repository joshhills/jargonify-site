import { Component, OnInit } from '@angular/core';
import { WordpressAPIPostService } from 'shared/services/post.service';
import { ActivatedRoute } from '@angular/router';
import { PostType } from 'shared/models/post';
import { PortfolioLayoutPost, PortfolioSectionType } from 'shared/models/portfolio-layout-post';
import { Observable } from 'rxjs/Observable';

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
    private postService: WordpressAPIPostService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        if (params['id']) {
          this.postService.getPortfolioLayout(
            params['id']
          ).subscribe(data => {
            this.layout = data;
          });
        } else {
          this.postService.getPortfolioLayout(
            '81'
          ).subscribe(data => {
            this.layout = data;
          });
        }
      }
    );

    this.postService.getPortfolioLayout(
      '81' // TODO: Make this default?
    ).subscribe(data => {
      this.layout = data;
    });
  }
}