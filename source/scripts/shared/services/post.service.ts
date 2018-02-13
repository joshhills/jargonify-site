import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { BlogPost } from 'shared/models/blog-post';
import { AppConfiguration } from 'app/app.configuration';

export interface PostService {
    baseUrl: string;

    getBlogPosts(
        page: number,
        perPage: number,
        featuredOnly: boolean,
        portfolioOnly: boolean,
        search: string
    ): Observable<BlogPost[]>;

    getBlogPost(id: string): Observable<BlogPost>;

    getNumBlogPosts(featuredOnly: boolean, search: string): Observable<number>;
}

@Injectable()
export class MockPostService implements PostService {
    // Store information necessary to make requests.
    baseUrl: string;
    headers: Headers;

    constructor(private appConfiguration: AppConfiguration, private http: Http) {
        this.baseUrl = process.env.API_URL;
        this.headers = new Headers();
        this.headers.append('Accept', 'application/json');
    }

    public getBlogPosts(
        page: number = 0,
        perPage: number = this.appConfiguration.MAX_BLOG_POSTS_PER_PAGE,
        featuredOnly: boolean = false,
        portfolioOnly: boolean = false,
        search: string = ''
    ): Observable<BlogPost[]> {
        let requestUrl;
        if (featuredOnly) {
            requestUrl = this.baseUrl + '/featured-blog-posts.json';
        } else if (portfolioOnly) {
            requestUrl = this.baseUrl + '/portfolio-blog-posts.json';
        } else if (search !== '') {
            requestUrl = this.baseUrl + '/search-blog-posts.json';
        } else {
            requestUrl = this.baseUrl + '/blog-posts.json';
        }

        let blogPosts = this.http
            .get(
                requestUrl,
                {
                    headers: this.headers
                }
            )
            .map(res => res.json().map(this.toBlogPost));
            // .catch();
        return blogPosts;
    }

    public getNumBlogPosts(
        featuredOnly: boolean = false,
        search: string = ''
    ): Observable<number> {
        if (featuredOnly) {
            return Observable.of(1);
        }
        if (search !== '') {
            return Observable.of(20);
        }
        return Observable.of(50);
    }

    public getBlogPost(id: string): Observable<BlogPost> {
        let blogPost = this.http
            .get(
                `${this.baseUrl}/blog-post.json`,
                {
                    headers: this.headers
                }
            )
            .map(res => res.json().map(this.toBlogPost));
        return blogPost;
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
            blob['isPortfolio'],
            blob['inSeries']
        );
    }
}

