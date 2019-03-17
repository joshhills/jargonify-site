import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { BlogPost } from '../shared/models/blog-post';
import { WindowService } from '../shared/services/window.service';

@Component({
  selector: 'blog-featured',
  templateUrl: '../../templates/blog/blog-featured.component.html'
})
export class BlogFeaturedComponent implements OnInit, OnChanges {
  @Input() featuredBlogPost: BlogPost;
  @ViewChild('fvideo') set ft(video: ElementRef) {
    if (video) {
      video.nativeElement.muted = true;
      video.nativeElement.play().catch();
    }
  }

  slug = '';

  constructor(
    public windowService: WindowService
  ) {
    this.windowService = windowService;
  }

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
    const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
    const to   = 'aaaaeeeeiiiioooouuuunc------';

    for (let i = 0, l = from.length ; i < l ; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    return str;
  }
}
