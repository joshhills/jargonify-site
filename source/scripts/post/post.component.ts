import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { WordpressAPIPostService } from 'shared/services/post.service';
import { HistoryService } from 'shared/services/history.service';
import { BlogPost } from 'shared/models/blog-post';

import 'rxjs/add/operator/filter';

@Component({
  selector: 'post',
  templateUrl: '../../templates/post/post.component.html',
  providers: [
    WordpressAPIPostService
  ]
})
export class PostComponent {
  post: BlogPost;

  // Control whether back navigation should be enabled.
  backEnabled: boolean = false;

  private routeParamsSub: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: WordpressAPIPostService,
    private location: Location,
    private historyService: HistoryService
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        if (params['id']) {
          this.getBlogPost(params['id']);
        }
      }
    );
    this.historyService.isNavigatedWithinApp().subscribe(
      res => {
        this.backEnabled = res;
      }
    );
  }

  getBlogPost(id: string): void {
    this.postService.getBlogPost(id).subscribe(
      res => this.post = res
    );
  }

  back() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
        this.router.navigate(['/']);
    }
  }
}