import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { BlogPost } from 'shared/models/blog-post';
import { AppConfiguration } from 'app/app.configuration';

@Injectable()
export class PostService {
    // Store information necessary to make requests.
    private baseUrl: string;
    private headers: Headers;

    constructor(private appConfiguration: AppConfiguration, private http: Http) {
        // TODO: Use config.
        this.baseUrl = process.env.API_URL;
        this.headers = new Headers();
        this.headers.append('Accept', 'application/json');
    }

    public getBlogPosts(
        page: number = 0,
        perPage: number = this.appConfiguration.MAX_BLOG_POSTS_PER_PAGE
    ): Observable<BlogPost[]> {
        let blogPosts = this.http
            .get(
                `${this.baseUrl}/blog-posts.json`,
                {
                    headers: this.headers
                }
            )
            .map(res => res.json().map(this.toBlogPost));
            // .catch();
        return blogPosts;
    }

    public getFeaturedBlogPosts(
        page: number = 0,
        perPage: number = this.appConfiguration.MAX_BLOG_POSTS_PER_PAGE
    ): Observable<BlogPost[]> {
        let featuredBlogPosts = this.http
            .get(
                `${this.baseUrl}/featured-blog-posts.json`,
                {
                    headers: this.headers
                }
            )
            .map(res => res.json().map(this.toBlogPost));
        return featuredBlogPosts;
    }

    public getBlogPost(id: string): BlogPost {
        return null;
    }

    public searchBlogPosts(searchText: string): Observable<BlogPost[]> {
        return null;
    }

    private toBlogPost(blob: JSON): BlogPost {
        return new BlogPost(
            blob['id'],
            blob['dateCreated'],
            blob['dateEdited'],
            blob['title'],
            blob['summary'],
            blob['featureImageUrl'],
            blob['contents'],
            blob['tags'],
            blob['isFeature'],
            blob['isPortfolio']
        );
    }
}

