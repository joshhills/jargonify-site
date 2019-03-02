import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { BlogPost } from '../models/blog-post';
import { AppConfiguration } from '../../app/app.configuration';
import { PortfolioLayoutPost,
    PortfolioSection,
    PostListPortfolioSection,
    PortfolioSectionType,
    TextBlockPortfolioSection,
    EndorsementPortfolioSection,
    PostWithOptions,
    ImageCarouselSection} from '../models/portfolio-layout-post';
import { Post, PostType } from '../models/post';
import { EndorsementPost, ContactType } from '../models/endorsement-post';
import { AnecdotePost } from '../models/anecdote-post';
import { Classification } from '../models/classification';
import { RoleMetadata } from '../models/role-metadata';
import { ImageCarousel, ImageWithCaption } from '../models/image-carousel';

export interface PostService {
    baseUrl: string;

    getBlogPosts(
        page: number,
        perPage: number,
        search: string
    ): Observable<BlogPost[]>;

    getBlogPost(id: string): Observable<BlogPost>;

    getNumBlogPosts(search: string): Observable<number>;

    getPortfolioLayout(id: string): Observable<PortfolioLayoutPost>;

    toPostListPortfolioSection(blob: JSON): PostListPortfolioSection;
}

// TODO: Fail gracefully.
@Injectable()
export class WordpressAPIPostService implements PostService {
    // Store information necessary to make requests.
    baseUrl: string;
    headers: HttpHeaders;

    constructor(private appConfiguration: AppConfiguration, private http: HttpClient) {
        this.baseUrl = environment.apiUrl;
        this.headers = new HttpHeaders().set('Accept', 'application/json');
    }

    public getBlogPosts(
        page: number = 0,
        perPage: number = this.appConfiguration.MAX_BLOG_POSTS_PER_PAGE,
        search: string = ''
    ): Observable<BlogPost[]> {
        // Define the full URL.
        const requestUrl = `${this.baseUrl}/posts?&`;

        // Define parameters.
        const params = new HttpParams()
            .set('per_page', perPage.toString())
            .set('page', (page + 1).toString())
            .set('search', search)
            .set('_embed', 'true')
            .set('filter[meta_key]', 'portfolio_only')
            .set('filter[meta_value]', '0');

        // Make request and mapping.
        const blogPosts: Observable<BlogPost[]> = this.http
            .get(
                requestUrl,
                {
                    headers: this.headers,
                    params
                }
            ).pipe(
                map(this.toBlogPosts.bind(this)));

        // Return the observable.
        return blogPosts;
    }

    public getNumBlogPosts(
        search: string = ''
    ): Observable<number> {
        // Define the full URL.
        const requestUrl = `${this.baseUrl}/posts`;

        // Define parameters.
        const params = new HttpParams()
            .set('per_page', '0')
            .set('search', search);

        // Make request and mapping.
        const numPosts = this.http
            .get(
                requestUrl,
                {
                    headers: this.headers,
                    params,
                    observe: 'response'
                }
            ).pipe(map((res: HttpResponse<any>) => {
                // Total count is returned as header.
                return +res.headers.get('x-wp-total');
            }));

        return numPosts;
    }

    public getBlogPost(id: string): Observable<BlogPost> {
        // Define the full URL.
        const requestUrl = `${this.baseUrl}/posts/${id}?&_embed`;

        // Make request and mapping.
        const blogPost = this.http
            .get(
                requestUrl,
                {
                    headers: this.headers
                }
            ).pipe(map((res: JSON) => this.toBlogPost(res)));

        return blogPost;
    }

    public getEndorsementPost(id: string): Observable<EndorsementPost> {
        // Define the full URL.
        const requestUrl = `${this.baseUrl}/endorsements/${id}`;

        // Make request and mapping.
        const endorsementPost = this.http
            .get(
                requestUrl,
                {
                    headers: this.headers
                }
            )
            .pipe(map((res: JSON) => {
                return this.toEndorsementPost(res);
            }));
        return endorsementPost;
    }

    public getPortfolioLayout(id: string): Observable<PortfolioLayoutPost> {
        // Define the full URL.
        const requestUrlSlug = `${this.baseUrl}/portfolio_layouts?&slug=${id}`;
        const requestUrlId = `${this.baseUrl}/portfolio_layouts/${id}`;

        // Make request and mapping.
        const portfolioLayout = this.http
            .get(
                requestUrlSlug,
                {
                    headers: this.headers
                }
            )
            .pipe(flatMap((res: any) => {
                if (res.length === 0) {
                    return this.http
                        .get(
                            requestUrlId,
                            {
                                headers: this.headers
                            }
                        ).pipe(map((res2: JSON) => {
                            return this.toPortfolioLayout(res2);
                        }));
                } else {
                    return of(this.toPortfolioLayout(res[0]));
                }
            }));
        return portfolioLayout;
    }

    private toPortfolioLayout(blob: JSON): PortfolioLayoutPost {
        const sections: PortfolioSection[] = [];

        for (const section of blob['acf']['content']) {
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
                case 'image_carousel':
                    // Create image carousel section.
                    sections.push(this.toImageCarouselSection(section));
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
        const posts: PostWithOptions[] = [];

        for (let i = 0; i < blob['posts'].length; i++) {
            const post: any = blob['posts'][i];

            switch (post['type']) {
                case 'blog':
                    // Get blog post.
                    this.getBlogPost(post['blog']).subscribe(
                        data => {
                            posts.splice(i, 0, new PostWithOptions(
                                data,
                                post['show_role_date'],
                                post['show_role_title'],
                                post['show_role_organisation']
                            ));
                        }
                    );
                    break;
                case 'anecdote':
                    // Make new anecdote post.
                    posts.splice(i, 0,
                        new PostWithOptions(
                            new AnecdotePost(
                                PostType.ANECDOTE,
                                null,
                                null,
                                null,
                                post['anecdote']
                            ),
                            null,
                            null,
                            null
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
        const endorsements: EndorsementPost[] = [];

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

    private toImageCarouselSection(blob: JSON): ImageCarouselSection {
        const isAnimated = blob['is_animated'];
        const items: ImageWithCaption[] = [];

        for (const item of blob['items']) {
            // Create the image.
            const caption: string = item['caption'];

            const image: any = {
                urlSmall: null,
                urlMedium: null,
                urlLarge: null,
                urlFull: null,
                srcSet: '',
                altText: null,
                title: null,
                caption: null
            };

            if (item['image']['sizes']['medium']) {
                image.urlSmall = item['image']['sizes']['medium'];
                image.srcSet += `${image.urlSmall} 300w, `;
            }

            if (item['image']['sizes']['medium_large']) {
                image.urlMedium = item['image']['sizes']['medium_large'];
                image.srcSet += `${image.urlMedium} 400w, `;
            }

            if (item['image']['sizes']['large']) {
                image.urlLarge = item['image']['sizes']['large'];
                image.srcSet += `${image.urlLarge} 1024w, `;
            }

            if (item['image']['url']) {
                image.urlFull = item['image']['url'];
                image.srcSet += `${image.urlFull} 1920w`;
            }

            image.title = item['image']['title'];
            image.altText = item['image']['alt'];
            image.caption = item['image']['caption'];

            items.push(new ImageWithCaption(image, caption));
        }

        return new ImageCarouselSection(
            PortfolioSectionType.IMAGE_CAROUSEL,
            new ImageCarousel(
                isAnimated,
                items
            )
        );
    }

    private toBlogPosts(blob: JSON[]): BlogPost[] {
        const blogPosts: BlogPost[] = [];

        blob.forEach(element => {
            blogPosts.push(this.toBlogPost(element));
        });

        return blogPosts;
    }

    private toBlogPost(blob: JSON): BlogPost {
        // Get the image features (some optional)
        const featureImage: any = {
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
            const featuredMedia: JSON = blob['_embedded']['wp:featuredmedia'][0];

            // TODO: Put this in an image class.
            if (featuredMedia['media_details']['sizes']['medium']) {
                featureImage.urlSmall = featuredMedia['media_details']['sizes']['medium']['source_url'];
                featureImage.srcSet += `${featureImage.urlSmall} 300w, `;
            }

            if (featuredMedia['media_details']['sizes']['medium_large']) {
                featureImage.urlMedium = featuredMedia['media_details']['sizes']['medium_large']['source_url'];
                featureImage.srcSet += `${featureImage.urlMedium} 400w, `;
            }

            if (featuredMedia['media_details']['sizes']['large']) {
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

        // TODO: Check if tags are already embedded!..
        // Get tags.
        const tags: string[] = [];

        // Define the full URL.
        const requestUrl = `${this.baseUrl}/tags/`;

        // Make request and mapping.
        for (const tag of blob['tags']) {
            this.http
            .get(
                requestUrl + tag,
                {
                    headers: this.headers
                }
            )
            .subscribe(res => {
                tags.push(res['name']);
            });
        }

        // Get related posts.
        const related: BlogPost[] = [];
        for (const relatedId of blob['acf']['related_posts']) {
            this.getBlogPost(relatedId).subscribe(
                res => {
                    related.push(res);
                }
            );
        }

        // Get custom field metadata.
        const classification = new Classification(
            blob['acf']['is_feature'],
            blob['acf']['is_collection'],
            blob['acf']['portfolio_only']
        );

        const responsibilities: string[] = [];
        if (blob['acf']['role_responsibilities']
            && blob['acf']['role_responsibilities'].length > 0) {
            for (const responsibility of blob['acf']['role_responsibilities']) {
                responsibilities.push(responsibility['role_responsibility']);
            }
        }

        const roleMetadata = new RoleMetadata(
            blob['acf']['role_title'],
            blob['acf']['role_type'],
            blob['acf']['organisation'],
            blob['acf']['role_is_current'],
            blob['acf']['role_start_date'],
            blob['acf']['role_end_date'],
            blob['acf']['role_type'],
            responsibilities
        );

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
            related,
            classification,
            roleMetadata
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
        const portraitImage: any = {
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
            contactDetails,
            blob['acf']['title'],
            blob['acf']['organisation']
        );
    }
}
