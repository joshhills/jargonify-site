import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BlogPost } from 'shared/models/blog-post';

@Component({
  selector: 'blog-list',
  templateUrl: '../../templates/blog/blog-list.component.html'
})
export class BlogListComponent implements OnChanges {
    @Input() blogPosts: BlogPost[];
    @Input() excludedPostIds: string[];

    ngOnChanges(changes: SimpleChanges) {
      if (changes['blogPosts']) {
        this.blogPosts = changes.blogPosts.currentValue;
      }
      if (changes['excludedPostIds']) {
        this.excludedPostIds = changes.excludedPostIds.currentValue;
      }
    }
}