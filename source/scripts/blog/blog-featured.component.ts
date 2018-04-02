import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BlogPost } from 'shared/models/blog-post';

@Component({
  selector: 'blog-featured',
  templateUrl: '../../templates/blog/blog-featured.component.html'
})
export class BlogFeaturedComponent implements OnChanges {
  @Input() featuredBlogPost: BlogPost;

  slug: string = '';

  ngOnChanges(changes: SimpleChanges) {
    this.featuredBlogPost = changes.featuredBlogPost.currentValue;
  }

  ngOnInit() {
    this.slug = this.toSlug(this.featuredBlogPost.title);
  }

  // TODO: Put in service.
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