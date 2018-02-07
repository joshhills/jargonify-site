import { Component, EventEmitter, Output } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'blog-search',
  templateUrl: '../../templates/blog/blog-search.component.html'
})
export class BlogSearchComponent {
  // Create an observable variable.
  private searchTerm: Subject<string> = new Subject<string>();
  @Output() onSearchTermChangedEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
    const searchTermStream = this.searchTerm.debounceTime(300)
      .distinctUntilChanged();

    searchTermStream.subscribe(
      input =>
        this.onSearchTermChangedEvent.emit(input)
    );
  }
}