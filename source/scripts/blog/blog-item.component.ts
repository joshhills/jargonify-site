import { Component, Input, OnInit } from '@angular/core';
import { BlogPost } from 'shared/models/blog-post';

@Component({
  selector: 'blog-item',
  templateUrl: '../../templates/blog/blog-item.component.html'
})
export class BlogItemComponent implements OnInit {
  @Input() blogPost: BlogPost;

  @Input() showReadMore: boolean = true;
  @Input() isExpanded: boolean = false;
  @Input() showDate: boolean = false;
  @Input() showPicture: boolean = false;

  private scrollTarget: any;

  ngOnInit() {
    this.scrollTarget = document.getElementById('bleed');
  }
}