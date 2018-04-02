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

  slug: string = '';

  ngOnInit() {
    this.slug = this.toSlug(this.blogPost.title);
  }

  toSlug(str: string): string {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    let from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
    let to   = 'aaaaeeeeiiiioooouuuunc------';

    for (let i = 0, l = from.length ; i < l ; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    return str;
  }
}