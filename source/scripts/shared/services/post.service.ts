import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { BlogPost } from 'shared/models/blog-post';
import { AppConfiguration } from 'app/app.configuration';
import { PortfolioLayoutPost, PortfolioSection, PostListPortfolioSection, PortfolioSectionType, TextBlockPortfolioSection, EndorsementPortfolioSection } from 'shared/models/portfolio-layout-post';
import { Post, PostType } from 'shared/models/post';
import { EndorsementPost, ContactType } from 'shared/models/endorsement-post';
import { AnecdotePost } from 'shared/models/anecdote-post';

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

    getPortfolioLayout(id: string): Observable<PortfolioLayoutPost>;

    toPostListPortfolioSection(blob: JSON): PostListPortfolioSection;
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
        // return Observable.empty<BlogPost[]>();
    }

    public getNumBlogPosts(
        featuredOnly: boolean = false,
        search: string = ''
    ): Observable<number> {
        if (featuredOnly) {
            return Observable.of(1);
        }
        if (search !== '') {
            return Observable.of(10);
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

    public getEndorsementPost(id: string): Observable<EndorsementPost> {
        let endorsementPost = this.http
            .get(
                `${this.baseUrl}/endorsement-post.json`,
                {
                    headers: this.headers
                }
            )
            .map(res => res.json().map(this.toEndorsementPost));
        return endorsementPost;
    }

    public getPortfolioLayout(id: string): Observable<PortfolioLayoutPost> {
        let portfolioLayout = this.http
            .get(
                `${this.baseUrl}/portfolio-layout.json`,
                {
                    headers: this.headers
                }
            )
            .map(res => res.json().map(this.toPortfolioLayout.bind(this)));
        return portfolioLayout;
    }

    private toBlogPost(blob: JSON): BlogPost {
        return new BlogPost(
            PostType.BLOG,
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

    private toEndorsementPost(blob: JSON): EndorsementPost {
        let contactType: ContactType;

        switch (blob['contactType']) {
            case 'email':
                contactType = ContactType.EMAIL;
                break;
            case 'link':
                contactType = ContactType.URL;
        }

        return new EndorsementPost(
            PostType.ENDORSEMENT,
            blob['id'],
            blob['dateCreated'],
            blob['dateEdited'],
            blob['fullName'],
            blob['testimonial'],
            blob['portraitImageUrl'],
            contactType,
            blob['contactDetails']
        );
    }

    // TODO: Make observable.
    private toPortfolioLayout(blob: JSON): PortfolioLayoutPost {
        let sections: PortfolioSection[] = [];

        for (let section of blob['sections']) {
            switch (section['type']) {
                case 'post_list':
                    // Create post list.
                    sections.push(this.toPostListPortfolioSection(section));
                    break;
                case 'text_block':
                    // Create text block.
                    sections.push(this.toTextBlockPortfolioSection(section));
                    break;
                case 'endorsement':
                    // Create endorsement.
                    sections.push(this.toEndorsementPortfolioSection(section));
                    break;
            }
        }

        return new PortfolioLayoutPost(
            PostType.PORTFOLIO_LAYOUT,
            blob['id'],
            blob['dateCreated'],
            blob['dateEdited'],
            blob['headerText'],
            sections
        );
    }

    // TODO: Change to be using observables.
    toPostListPortfolioSection(blob: JSON): PostListPortfolioSection {
        let posts: Post[] = [];

        for (let i = 0; i < blob['posts'].length; i++) {
            let post: any = blob['posts'][i];

            switch (post['type']) {
                case 'blog':
                    // Get blog post.
                    this.getBlogPost(post['blog']).subscribe(
                        data => {
                            posts.splice(i, 0, data[0]);
                        }
                    );
                    break;
                case 'anecdote':
                    // Make new anecdote post.
                    posts.splice(i, 0,
                        new AnecdotePost(
                            PostType.ANECDOTE,
                            '-1', // TODO: This is not applicable here.
                            '-1',
                            '-1',
                            post['anecdote']
                        )
                    );
                    break;
            }
        }

        return new PostListPortfolioSection(
            PortfolioSectionType.POST_LIST,
            blob['title'],
            posts
        );
    }

    private toTextBlockPortfolioSection(blob: JSON): TextBlockPortfolioSection {
        // Information already present in JSON, no need for get.
        return new TextBlockPortfolioSection(
            PortfolioSectionType.TEXT_BLOCK,
            blob['theme'],
            blob['content']
        );
    }

    private toEndorsementPortfolioSection(blob: JSON): EndorsementPortfolioSection {
        // Get endorsement post. blob['post']
        let endorsements: EndorsementPost[] = [];

        this.getEndorsementPost(blob['post']).subscribe(
            data => {
                endorsements.push(data[0]);
            }
        );

        return new EndorsementPortfolioSection(
            PortfolioSectionType.ENDORSEMENT,
            endorsements
        );
    }
}

