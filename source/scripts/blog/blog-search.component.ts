import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'blog-search',
  templateUrl: '../../templates/blog/blog-search.component.html'
})
export class BlogSearchComponent implements OnInit {
  // Create an observable variable.
  searchTerm: Subject<string> = new Subject<string>();
  prePopulatedSearchTerm: string = '';
  @Output() onSearchTermChangedEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private route: ActivatedRoute
  ) {
    const searchTermStream = this.searchTerm.debounceTime(300)
      .distinctUntilChanged();

    searchTermStream.subscribe(
      input =>
        this.onSearchTermChangedEvent.emit(input)
    );
  }

  ngOnInit() {
    this.route.queryParams
      .filter(params => params['search'])
      .subscribe(params => {
        this.prePopulatedSearchTerm = params['search'];
      });
  }
}