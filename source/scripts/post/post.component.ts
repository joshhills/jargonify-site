import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WordpressAPIPostService } from 'shared/services/post.service';
import { BlogPost } from 'shared/models/blog-post';

@Component({
  selector: 'post',
  templateUrl: '../../templates/post/post.component.html',
  providers: [
    WordpressAPIPostService
  ]
})
export class PostComponent {
  post: BlogPost;
  private routeParamsSub: any;

  constructor(
    private route: ActivatedRoute,
    private postService: WordpressAPIPostService
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
      res => this.post = res
    );
  }
}