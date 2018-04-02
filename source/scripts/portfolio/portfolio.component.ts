import { Component, OnInit } from '@angular/core';
import { WordpressAPIPostService } from 'shared/services/post.service';
import { ActivatedRoute } from '@angular/router';
import { PostType } from 'shared/models/post';
import { PortfolioLayoutPost, PortfolioSectionType } from 'shared/models/portfolio-layout-post';
import { Observable } from 'rxjs/Observable';
import { HistoryService } from 'shared/services/history.service';

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
    private route: ActivatedRoute,
    private historyService: HistoryService
  ) {}

  ngOnInit() {
    let idToGet: string;

    // TODO: Convert to Observable.zip(...)
    this.route.params.subscribe(
      params => {
        this.historyService.getLandedPortfolioLayoutId().subscribe(landedId => {
          if (params['id']) {
            if (landedId === null) {
              idToGet = params['id'];
              this.historyService.setLandedPortfolioLayoutId(idToGet);
            } else {
              idToGet = landedId;
            }

            this.getPortfolioLayout(idToGet);
          } else {
            if (landedId !== null) {
              idToGet = landedId;
            } else {
              idToGet = '81';
            }
            this.getPortfolioLayout(idToGet);
          }
        });
      }
    );
  }

  private getPortfolioLayout(id: string): void {
    this.postService.getPortfolioLayout(
      id
    ).subscribe(data => {
      this.layout = data;
    },
    err => {
      this.getPortfolioLayout('81');
    });
  }
}