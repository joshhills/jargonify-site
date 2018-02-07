import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MockPostService } from 'shared/services/post.service';
import { BlogPost } from 'shared/models/blog-post';

@Component({
  selector: 'post',
  templateUrl: '../../templates/post/post.component.html'
})
export class PostComponent {
  private post: BlogPost;
  private routeParamsSub: any;

  constructor(
    private route: ActivatedRoute,
    private postService: MockPostService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        if (params['id']) {
          this.getBlogPost(params['id']);
        }
      }
    );
  }

  getBlogPost(id: string): void {
    this.postService.getBlogPost(id).subscribe(
      res => this.post = res[0]
    );
  }
}