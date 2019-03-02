import { Component, Input, OnInit } from '@angular/core';
import { BlogPost } from '../shared/models/blog-post';
import { CookieService } from 'ngx-cookie-service';
import { WindowService } from '../shared/services/window.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'blog-item',
  templateUrl: '../../templates/blog/blog-item.component.html'
})
export class BlogItemComponent implements OnInit {
  @Input() blogPost: BlogPost;

  @Input() showReadMore = true;
  @Input() isExpanded = false;
  @Input() showDate = false;
  @Input() showPicture = false;
  @Input() showRoleDate = false;
  @Input() showRoleTitle = false;
  @Input() showRoleOrganisation = false;
  read = false;

  slug = '';

  constructor(
    private cookieService: CookieService,
    private windowService: WindowService,
    private domSanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
    this.slug = this.toSlug(this.blogPost.title);

    // Check if it has been read before.
    let visited: any[] = [];
    if (this.cookieService.get('visited')) {
      visited = JSON.parse(this.cookieService.get('visited'));
    }
    this.read = visited.indexOf(this.blogPost.id) !== -1;
  }

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
