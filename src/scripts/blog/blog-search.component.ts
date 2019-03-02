import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'blog-search',
  templateUrl: '../../templates/blog/blog-search.component.html'
})
export class BlogSearchComponent implements OnInit {
  // Create an observable variable.
  searchTerm: Subject<string> = new Subject<string>();
  prePopulatedSearchTerm = '';
  @Output() searchTermChangedEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private route: ActivatedRoute
  ) {
    const searchTermStream = this.searchTerm.pipe(debounceTime(300)).pipe(distinctUntilChanged());

    searchTermStream.subscribe(
      input =>
        this.searchTermChangedEvent.emit(input)
    );
  }

  ngOnInit() {
    this.route.queryParams
      .pipe(
        filter(params => params['search']))
      .subscribe(params => {
        this.prePopulatedSearchTerm = params['search'];
      });
  }
}
