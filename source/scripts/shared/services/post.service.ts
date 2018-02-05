import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { BlogPost } from 'shared/models/blog-post';

@Injectable()
export class PostService {
    // Store information necessary to make requests.
    private baseUrl: string;
    private headers: Headers;

    constructor(private http: Http) {
        // TODO: Use config.
        this.baseUrl = '/posts/';
        this.headers = new Headers();
        this.headers.append('Accept', 'application/json');
    }

    public getBlogPosts(): Observable<BlogPost[]> {
        let blogPosts = this.http
            .get(
                `${this.baseUrl}/`,
                {
                    headers: this.headers
                }
            )
            .map(res => res.json().results.map(this.toBlogPost));
            // .catch();
        return blogPosts;
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

