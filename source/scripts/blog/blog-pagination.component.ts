import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AppConfiguration } from 'app/app.configuration';

@Component({
  selector: 'blog-pagination',
  templateUrl: '../../templates/blog/blog-pagination.component.html'
})
export class BlogPaginationComponent implements OnChanges {
  @Input() currentPage: number;
  @Input() numPages: number;

  private show: boolean = false;

  private previousNavigationEnabled: boolean = false;
  private nextNavigationEnabled: boolean = true;

  private neighbourhood: number[] = [];

  private previousGap: boolean = false;
  private nextGap: boolean = false;

  constructor(
    private appConfiguration: AppConfiguration
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentPage']) {
      this.currentPage = changes.currentPage.currentValue;
    }
    if (changes['numPages']) {
      this.numPages = changes.numPages.currentValue;
    }

    this.determinePageElements();
  }

  determinePageElements(): void {
    this.show = this.numPages > 1 && this.currentPage <= this.numPages;
    if (!this.show) {
      return;
    }

    this.previousNavigationEnabled = this.currentPage > 0;
    this.nextNavigationEnabled = this.currentPage < this.numPages;

    this.neighbourhood = [];
    for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
      if (i > 0 && i < this.numPages - 1) {
        this.neighbourhood.push(i);
      }
    }

    this.previousGap = this.neighbourhood.length > 0
      && this.neighbourhood[0] > 1;

    this.nextGap = this.neighbourhood.length > 0
      && this.neighbourhood[this.neighbourhood.length - 1] < this.numPages - 2;
  }
}