import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BlogPost } from 'shared/models/blog-post';

@Component({
  selector: 'blog-featured',
  templateUrl: '../../templates/blog/blog-featured.component.html'
})
export class BlogFeaturedComponent implements OnChanges {
  @Input() featuredBlogPost: BlogPost;

  ngOnChanges(changes: SimpleChanges) {
    this.featuredBlogPost = changes.featuredBlogPost.currentValue;
  }
}