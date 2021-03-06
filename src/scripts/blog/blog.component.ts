import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppConfiguration } from '../app/app.configuration';
import { WordpressAPIPostService } from '../shared/services/post.service';
import { BlogPost } from '../shared/models/blog-post';
import { combineLatest, Subscription, Observable, forkJoin } from 'rxjs';
import { WindowService } from '../shared/services/window.service';
import { Tag } from '../shared/models/tag';
import { Category } from '../shared/models/category';
import { Location } from '@angular/common';

@Component({
  selector: 'blog',
  templateUrl: '../../templates/blog/blog.component.html',
  providers: [
    WordpressAPIPostService
  ]
})
export class BlogComponent implements OnInit {
  private routeParamsSub: any;
  private queryParamsSub: any;

  @ViewChild('cover') cover: ElementRef;

  featuredBlogPost: BlogPost;
  blogPosts: BlogPost[] = [];
  excludedPostIds: string[] = [];

  currentPage = 0;
  numPosts = 0;
  numPostsInAll = 0;
  numPages = 1;

  inSearch = false;
  searchTerm = '';
  tag: any = '';
  categoryName = '';
  tagName = '';
  category = '';
  handlingChange = true;

  noPostsAfterFetch = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appConfiguration: AppConfiguration,
    private postService: WordpressAPIPostService,
    private windowService: WindowService,
    private location: Location
  ) {}

  setPageProperties(data: any): void {
    this.currentPage = data['page'] ? +data['page'] - 1 : 0;
  }

  setSearchProperties(data: any): void {
    this.searchTerm = data['search'] ? data['search'] : '';
    this.tag = data['tag'] ? data['tag'] : '';
    this.tag = this.tag.replace(' ', '-').replace('%20', '-');
    this.tagName = this.tag;
    this.category = data['category'] && data['category'] !== 'all' ? data['category'] : '';
    this.category = this.category.replace(' ', '-').replace('%20', '-');
    this.categoryName = this.category;
    this.inSearch = this.searchTerm.trim().length > 0 || this.tag !== '' || this.category !== '';
  }

  fetchBlogPostProperties(): void {
    const numPosts = this.currentPage === 0
      ? this.appConfiguration.MAX_BLOG_POSTS_PER_PAGE + 1
      : this.appConfiguration.MAX_BLOG_POSTS_PER_PAGE;

    // Get the number of blog posts with this criteria.
    this.postService.getNumBlogPosts(
      this.searchTerm,
      [this.tag],
      [this.category]
    ).subscribe(data => {
      this.numPosts = data;
      this.numPages = Math.ceil((data - 1)
        / (this.appConfiguration.MAX_BLOG_POSTS_PER_PAGE + 1));
    });

    // Get the individual posts.
    this.postService.getBlogPosts(
      this.currentPage,
      this.appConfiguration.MAX_BLOG_POSTS_PER_PAGE + 1,
      this.searchTerm,
      [this.tag],
      [this.category]
    ).subscribe(data => {
      this.blogPosts = data;

      this.noPostsAfterFetch = this.blogPosts.length === 0;

      if (this.noPostsAfterFetch && this.category !== '') {
        this.postService.getNumBlogPosts(
          this.searchTerm,
          [],
          []
        ).subscribe(data2 => {
          this.numPostsInAll = data2;
        });
      }

      if (this.currentPage === 0 && !this.inSearch) {
        this.fetchFeaturedBlogPost();
      } else {
        this.excludedPostIds = [];
        this.handlingChange = false;
      }
    },
    err => {
      this.noPostsAfterFetch = true;
      this.handlingChange = false;
    });
  }

  fetchFeaturedBlogPost(): void {
    // Determine featured blog post from current list.
    for (const post of this.blogPosts) {
      if (post.classification.isFeature) {
        this.featuredBlogPost = post;
        if (!this.inSearch) {
          this.excludedPostIds = [post.id];
        }
        break;
      }
    }
    this.handlingChange = false;
  }

  ngOnInit() {
    combineLatest(
      this.route.params,
      this.route.queryParams
    ).subscribe(
      data => {
        this.initPage(data[0], data[1]);
      }
    );
  }

  initPage(params: any, queryParams: any): void {
    this.setPageProperties(params);
    this.setSearchProperties(queryParams);

    if (this.currentPage === 0 && !this.inSearch) {
      this.scrollToTopOfPage();
    }

    const tagAndCategoryOperations: any[] = [];

    if (this.tag !== '' && isNaN(parseInt(this.tag, 10))) {
      tagAndCategoryOperations.push(this.postService.getTag(this.tag));
    }

    if (this.category !== '' && isNaN(parseInt(this.category, 10))) {
      tagAndCategoryOperations.push(this.postService.getCategory(this.category));
    }

    if (tagAndCategoryOperations.length > 0) {
      forkJoin(tagAndCategoryOperations).subscribe((d) => {
        for (const response of d) {
          if (response instanceof Tag) {
            this.tag = response.id;
            this.tagName = response.name;
          }
          if (response instanceof Category) {
            this.category = response.id;
            this.categoryName = response.name;
          }
        }

        if (this.tag !== '' && isNaN(parseInt(this.tag, 10))
        || this.category !== '' && isNaN(parseInt(this.category, 10))) {
          this.numPosts = 0;
          this.noPostsAfterFetch = true;
          this.numPages = 0;
          return;
        }

        this.fetchBlogPostProperties();
      });
    } else {
      this.fetchBlogPostProperties();
    }
  }

  searchTermChangedEvent(term: string): void {
    this.handlingChange = true;

    let queryString = '';
    const queryParams = {};

    if (term.trim().length > 0) {
      queryParams['search'] = term;
      queryString += `?search=${term}`;
    }

    if (this.categoryName !== '') {
      queryParams['category'] = this.categoryName;
      if (queryString === '') {
        queryString += `?category=${this.categoryName}`;
      } else {
        queryString += `&category=${this.categoryName}`;
      }
    }

    if (this.tagName !== '') {
      queryParams['tag'] = this.tagName;
      if (queryString === '') {
        queryString += `?tag=${this.tagName}`;
      } else {
        queryString += `&tag=${this.tagName}`;
      }
    }

    const url = `/blog${queryString}`;
    this.location.go(url);
    this.initPage({}, queryParams);
  }

  categoryChangedEvent(term: string): void {
    this.handlingChange = true;

    let queryString = '';
    const queryParams = {};

    if (this.searchTerm !== '') {
      queryParams['search'] = this.searchTerm;
      queryString += `?search=${this.categoryName}`;
    }

    if (term.trim().length > 0) {
      queryParams['category'] = term;
      if (queryString === '') {
        queryString += `?category=${term}`;
      } else {
        queryString += `&category=${term}`;
      }
    }

    if (this.tagName !== '') {
      queryParams['tag'] = this.tagName;
      if (queryString === '') {
        queryString += `?tag=${this.tagName}`;
      } else {
        queryString += `&tag=${this.tagName}`;
      }
    }

    const url = `/blog${queryString}`;
    this.location.go(url);
    this.initPage({}, queryParams);
  }

  scrollToTopOfPage(): void {
    this.windowService.getNativeWindow().scrollTo({top: 0, behavior: 'smooth', inline: 'nearest'});
    this.windowService.getNativeWindow().document.getElementById('bleed').scrollTo({top: 0, behavior: 'smooth', inline: 'nearest'});
  }
}
