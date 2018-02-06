import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PostService } from 'shared/services/post.service';
import { AppConfiguration } from 'app/app.configuration';

@Component({
  selector: 'blog-pagination',
  templateUrl: '../../templates/blog/blog-pagination.component.html'
})
export class BlogPaginationComponent implements OnChanges {
  @Input() currentPage: number;
  @Input() numPages: number;

  private previousNavigationEnabled: boolean = false;
  private nextNavigationEnabled: boolean = true;

  private neighbourhood: number[] = [];

  private isPreviousGap: boolean = false;
  private isNextGap: boolean = false;

  constructor(
    private postService: PostService,
    private appConfiguration: AppConfiguration
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    this.currentPage = changes.currentPage.currentValue;
    this.numPages = changes.numPages.currentValue;

    this.determinePageElements();
  }

  determinePageElements(): void {
    this.previousNavigationEnabled = this.currentPage > 0;
    this.nextNavigationEnabled = this.currentPage < this.numPages;

    this.neighbourhood = [];
    for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
      if (i > 0 && i < this.numPages) {
        this.neighbourhood.push(i);
      }
    }

    this.isPreviousGap = this.neighbourhood.length > 0
      && this.neighbourhood[0] > 1;

    this.isNextGap = this.neighbourhood.length > 0
      && this.neighbourhood[this.neighbourhood.length - 1] < this.numPages;
  }
}