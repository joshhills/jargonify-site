import { Component, Input } from '@angular/core';
import { BlogPost } from 'shared/models/blog-post';

@Component({
  selector: 'blog-list',
  templateUrl: '../../templates/blog/blog-list.component.html'
})
export class BlogListComponent {
    @Input() blogPosts: BlogPost[];
    @Input() excludedPostIds: string[];
}