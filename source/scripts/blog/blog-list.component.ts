import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { BlogPost } from 'shared/models/blog-post';

@Component({
  selector: 'blog-list',
  templateUrl: '../../templates/blog/blog-list.component.html'
})
export class BlogListComponent implements OnChanges, OnInit {
    @Input() fresh: boolean = true;
    @Input() blogPosts: BlogPost[];
    @Input() excludedPostIds: string[];
    @Input() currentPage: number = 0;

    @ViewChild('blogList') blogList: ElementRef;

    private postIndicesToShowPictures: number[] = [+1, +2, +4, +7, +9];

    ngOnInit() {
      this.removeExcludedBlogPosts();
    }

    removeExcludedBlogPosts(): void {
      for (let id of this.excludedPostIds) {
        let index = this.blogPosts.map(p => p.id).indexOf(id);
        if (index !== -1) {
          this.blogPosts.splice(index, 1);
        }
      }
    }

    ngOnChanges(changes: SimpleChanges) {
      if (changes['blogPosts']) {
        this.blogPosts = changes.blogPosts.currentValue;
      }
      if (changes['excludedPostIds']) {
        this.excludedPostIds = changes.excludedPostIds.currentValue;
      }
      if (changes['currentPage']) {
        if (changes.currentPage.currentValue !== 0) {
          this.scrollToTopOfBlogList();
        }
      }
      this.removeExcludedBlogPosts();
    }

    scrollToTopOfBlogList(): void {
      this.blogList.nativeElement.scrollIntoView();
    }
}