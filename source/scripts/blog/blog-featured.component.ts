import { Component, Input } from '@angular/core';
import { BlogPost } from 'shared/models/blog-post';

@Component({
  selector: 'blog-featured',
  templateUrl: '../../templates/blog/blog-featured.component.html'
})
export class BlogFeaturedComponent {
  @Input() blogPost: BlogPost;

  // Modifiers.
  @Input() showDate: boolean = false;
  @Input() showTag: boolean = false;
}