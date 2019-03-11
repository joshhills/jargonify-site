import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'blog-search',
  templateUrl: '../../templates/blog/blog-search.component.html'
})
export class BlogSearchComponent implements OnInit {
  searchTerm: Subject<string> = new Subject<string>();
  prePopulatedSearchTerm = '';
  @Output() searchTermChangedEvent: EventEmitter<string> = new EventEmitter<string>();

  category: Subject<string> = new Subject<string>();
  prePopulatedCategory = '';
  @Output() categoryChangedEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private route: ActivatedRoute
  ) {
    const searchTermStream = this.searchTerm.pipe(debounceTime(300)).pipe(distinctUntilChanged());

    searchTermStream.subscribe(
      input =>
        this.searchTermChangedEvent.emit(input.trim())
    );

    const categoryStream = this.category.pipe(debounceTime(300)).pipe(distinctUntilChanged());

    categoryStream.subscribe(
      input => {
        this.categoryChangedEvent.emit(input.trim());
      }
    );
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.prePopulatedSearchTerm = params['search'];
        this.prePopulatedCategory = params['category'];
      });
  }
}
