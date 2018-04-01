import { Http, Response, Headers, URLSearchParams } from '@angular/http';
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
        search: string
    ): Observable<BlogPost[]>;

    getBlogPost(id: string): Observable<BlogPost>;

    getNumBlogPosts(featuredOnly: boolean, search: string): Observable<number>;

    getPortfolioLayout(id: string): Observable<PortfolioLayoutPost>;

    toPostListPortfolioSection(blob: JSON): PostListPortfolioSection;
}

// TODO: Fail gracefully.
@Injectable()
export class WordpressAPIPostService implements PostService {
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
        search: string = ''
    ): Observable<BlogPost[]> {
        // Define the full URL.
        let requestUrl: string = `${this.baseUrl}/posts?&`;

        // Define parameters.
        let params = new URLSearchParams();
        params.append('per_page', perPage.toString());
        params.append('page', (page + 1).toString());
        params.append('search', search);
        params.append('_embed', 'true');

        // Make request and mapping.
        let blogPosts = this.http
            .get(
                requestUrl,
                {
                    headers: this.headers,
                    params: params
                }
            )
            .catch((err: any, caught: Observable<any>) => {
                console.log('shit');
                return Observable.empty<Response>();
            })
            .map(res => res.json().map(this.toBlogPost.bind(this)));

        // Return the observable.
        return blogPosts;
    }

    public getNumBlogPosts(
        featuredOnly: boolean = false,
        search: string = ''
    ): Observable<number> {
        // Define the full URL.
        let requestUrl: string = `${this.baseUrl}/posts`;

        // Define parameters.
        let params = new URLSearchParams();
        params.append('per_page', '0');
        params.append('search', search);

        // Make request and mapping.
        let numPosts = this.http
            .get(
                requestUrl,
                {
                    headers: this.headers,
                    params: params
                }
            )
            .map(res => {
                // Total count is returned as header.
                return +res.headers.get('x-wp-total');
            });

        return numPosts;
    }

    public getBlogPost(id: string): Observable<BlogPost> {
        // Define the full URL.
        let requestUrl: string = `${this.baseUrl}/posts/${id}?&_embed`;

        // Make request and mapping.
        let blogPost = this.http
            .get(
                requestUrl,
                {
                    headers: this.headers
                }
            )
            .map(res => this.toBlogPost(res.json()));

        return blogPost;
    }

    public getEndorsementPost(id: string): Observable<EndorsementPost> {
        // Define the full URL.
        let requestUrl: string = `${this.baseUrl}/endorsements/${id}`;

        // Make request and mapping.
        let endorsementPost = this.http
            .get(
                requestUrl,
                {
                    headers: this.headers
                }
            )
            .map(res => {
                return this.toEndorsementPost(res.json());
            });
        return endorsementPost;
    }

    public getPortfolioLayout(id: string): Observable<PortfolioLayoutPost> {
        // Define the full URL.
        let requestUrl: string = `${this.baseUrl}/portfolio_layouts/${id}`;

        // Make request and mapping.
        let portfolioLayout = this.http
            .get(
                requestUrl,
                {
                    headers: this.headers
                }
            )
            .map(res => {
                return this.toPortfolioLayout(res.json());
            });
        return portfolioLayout;
    }

    private toPortfolioLayout(blob: JSON): PortfolioLayoutPost {
        let sections: PortfolioSection[] = [];

        for (let section of blob['acf']['content']) {
            switch (section['acf_fc_layout']) {
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
            blob['date'],
            blob['modified'],
            blob['content']['rendered'],
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
                            posts.splice(i, 0, data);
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
        // Get endorsement post.
        let endorsements: EndorsementPost[] = [];

        this.getEndorsementPost(blob['post']).subscribe(
            data => {
                endorsements.push(data);
            }
        );

        return new EndorsementPortfolioSection(
            PortfolioSectionType.ENDORSEMENT,
            endorsements
        );
    }

    // TODO: Graceful degradation
    private toBlogPost(blob: JSON): BlogPost {
        // Get the image features (some optional)
        let featureImage: any = {
            urlSmall: null,
            urlMedium: null,
            urlLarge: null,
            urlFull: null,
            srcSet: '',
            altText: null,
            title: null,
            caption: null
        };

        // Retrieve all of the necessary URLs.
        if (blob['_embedded'] && blob['_embedded']['wp:featuredmedia']) {
            let featuredMedia: JSON = blob['_embedded']['wp:featuredmedia'][0];

            // TODO: Put this in an image class.
            if (featuredMedia['media_details']['sizes']['medium']) {
                featureImage.urlSmall = featuredMedia['media_details']['sizes']['medium']['source_url'];
                featureImage.srcSet += `${featureImage.urlSmall} 300w, `;
            }

            if (featuredMedia['media_details']['sizes']['medium_large']) {
                featureImage.urlMedium = featuredMedia['media_details']['sizes']['medium_large']['source_url'];
                featureImage.srcSet += `${featureImage.urlMedium} 400w, `;
            }

            if (featureImage.urlLarge = featuredMedia['media_details']['sizes']['large']) {
                featureImage.urlLarge = featuredMedia['media_details']['sizes']['large']['source_url'];
                featureImage.srcSet += `${featureImage.urlLarge} 1024w, `;
            }

            if (featuredMedia['media_details']['sizes']['full']) {
                featureImage.urlFull = featuredMedia['media_details']['sizes']['full']['source_url'];
                featureImage.srcSet += `${featureImage.urlFull} 1920w`;
            }

            featureImage.title = featuredMedia['title']['rendered'];
            featureImage.altText = featuredMedia['alt_text'];
            featureImage.caption = featuredMedia['caption']['rendered'];
        }

        // TODO: Get tags.
        let tags: string[] = [];

        // Define the full URL.
        let requestUrl: string = `${this.baseUrl}/tags`;

        // Make request and mapping.
        let numPosts = this.http
            .get(
                requestUrl,
                {
                    headers: this.headers
                }
            )
            .subscribe(res => {
                let data = JSON.parse(res['_body']);
                for (let tag of blob['tags']) {
                    for (let item of data) {
                        if (tag === item['id']) {
                            tags.push(item['name']);
                            break;
                        }
                    }
                }
            });

        return new BlogPost(
            PostType.BLOG,
            blob['id'],
            blob['date'],
            blob['modified'],
            blob['title']['rendered'],
            blob['excerpt']['rendered'],
            featureImage,
            blob['content']['rendered'],
            tags,
            blob['acf']['is_feature'],
            blob['acf']['is_portfolio'],
            false
        );
    }

    private toEndorsementPost(blob: JSON): EndorsementPost {
        let contactType: ContactType;
        let contactDetails: string;

        switch (blob['acf']['contact_type']) {
            case 'email':
                contactType = ContactType.EMAIL;
                contactDetails = blob['acf']['email'];
                break;
            case 'url':
                contactType = ContactType.URL;
                contactDetails = blob['acf']['link'];
        }

        // Get the image features (some optional)
        let portraitImage: any = {
            urlSmall: null,
            urlMedium: null,
            urlLarge: null,
            urlFull: null,
            srcSet: '',
            altText: null,
            title: null,
            caption: null
        };

        if (blob['acf']['portrait']) {
            if (blob['acf']['portrait']['sizes']['medium']) {
                portraitImage.urlSmall = blob['acf']['portrait']['sizes']['medium'];
                portraitImage.srcSet += `${portraitImage.urlSmall} 300w, `;
            }

            if (blob['acf']['portrait']['sizes']['medium_large']) {
                portraitImage.urlMedium = blob['acf']['portrait']['sizes']['medium_large'];
                portraitImage.srcSet += `${portraitImage.urlMedium} 400w, `;
            }

            if (blob['acf']['portrait']['sizes']['large']) {
                portraitImage.urlLarge = blob['acf']['portrait']['sizes']['large'];
                portraitImage.srcSet += `${portraitImage.urlLarge} 1024w, `;
            }

            if (blob['acf']['portrait']['url']) {
                portraitImage.urlFull = blob['acf']['portrait']['url'];
                portraitImage.srcSet += `${portraitImage.urlFull} 1920w`;
            }
        }

        portraitImage.title = blob['acf']['portrait']['title'];
        portraitImage.altText = blob['acf']['portrait']['alt'];
        portraitImage.caption = blob['acf']['portrait']['caption'];

        return new EndorsementPost(
            PostType.ENDORSEMENT,
            blob['id'],
            blob['date'],
            blob['modified'],
            blob['acf']['full_name'],
            blob['acf']['testimonial'],
            portraitImage,
            contactType,
            contactDetails
        );
    }
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
        search: string = ''
    ): Observable<BlogPost[]> {
        let requestUrl;
        if (featuredOnly) {
            requestUrl = this.baseUrl + '/featured-blog-posts.json';
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
            .map(res => res.json().map(this.toBlogPost.bind(this)));

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
        // Get the image features (some optional)
        let featureImage: any = {
            urlSmall: null,
            urlLarge: null,
            urlFull: null,
            altText: null,
            title: null,
            caption: null
        };

        featureImage.urlSmall = featureImage.urlLarge = featureImage.urlFull = blob['featureImageUrl'];

        return new BlogPost(
            PostType.BLOG,
            blob['id'],
            blob['dateCreated'],
            blob['dateEdited'],
            blob['title'],
            blob['summary'],
            featureImage,
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

