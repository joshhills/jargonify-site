import { Component, Input } from '@angular/core';
import { BlogPost } from 'shared/models/blog-post';

@Component({
  selector: 'blog-item',
  templateUrl: '../../templates/blog/blog-item.component.html'
})
export class BlogItem {
  @Input() blogPost: BlogPost;

  // Modifiers.
  @Input() showReadMore: boolean = true;
  @Input() isExpanded: boolean = false;
  @Input() showDate: boolean = false;
}