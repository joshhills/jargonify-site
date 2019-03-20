import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
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
import { Post, PostType, PostSection, TextPostSection, PostSectionType, ImagePostSection, ImageCarouselPostSection } from '../models/post';
import { EndorsementPost, ContactType } from '../models/endorsement-post';
import { AnecdotePost } from '../models/anecdote-post';
import { Classification } from '../models/classification';
import { RoleMetadata } from '../models/role-metadata';
import { ImageCarousel, ImageWithCaption } from '../models/image-carousel';
import { Tag } from '../models/tag';
import { Category } from '../models/category';
import { Video, VideoSource } from '../models/video';

export interface PostService {
    baseUrl: string;

    getBlogPosts(
        page: number,
        perPage: number,
        search: string,
        tags: string[],
        categories: string[]
    ): Observable<BlogPost[]>;

    getBlogPost(id: string): Observable<BlogPost>;

    getNumBlogPosts(
        search: string,
        tags: string[],
        categories: string[]
    ): Observable<number>;

    getPortfolioLayout(id: string): Observable<PortfolioLayoutPost>;

    toPostListPortfolioSection(blob: JSON): PostListPortfolioSection;

    getTag(name: string): Observable<Tag>;
    toTag(blob: JSON): Tag;

    getCategory(name: string): Observable<Category>;
    toCategory(blob: JSON): Category;
}

// TODO: Fail gracefully.
@Injectable()
export class WordpressAPIPostService implements PostService {
    // Store information necessary to make requests.
    baseUrl: string;
    headers: HttpHeaders;

    constructor(private appConfiguration: AppConfiguration, private http: HttpClient, private domSanitizer: DomSanitizer) {
        this.baseUrl = environment.apiUrl;
        this.headers = new HttpHeaders().set('Accept', 'application/json');
    }

    public toCategory(blob: JSON): Tag {
        return new Category(
            blob['id'],
            blob['slug']
        );
    }

    public getCategory(name: string): Observable<Category> {
        const requestUrl = `${this.baseUrl}/categories?&slug=${name}`;

        const category: Observable<Category> = this.http
            .get(
                requestUrl,
                {
                    headers: this.headers
                }
            ).pipe(
                map((data: any) => {
                    if (data.length !== 0) {
                        return this.toCategory(data[0]);
                    }
                }));

        return category;
    }

    public toTag(blob: JSON): Tag {
        return new Tag(
            blob['id'],
            blob['slug']
        );
    }

    public getTag(name: string): Observable<Tag> {
        const requestUrl = `${this.baseUrl}/tags?&slug=${name}`;

        const tag: Observable<Tag> = this.http
            .get(
                requestUrl,
                {
                    headers: this.headers
                }
            ).pipe(
                map((data: any) => {
                    if (data.length !== 0) {
                        return this.toTag(data[0]);
                    }
                }));

        return tag;
    }

    public getBlogPosts(
        page: number = 0,
        perPage: number = this.appConfiguration.MAX_BLOG_POSTS_PER_PAGE,
        search: string = '',
        tags: string[] = [],
        categories: string[] = []
    ): Observable<BlogPost[]> {
        // Define the full URL.
        const requestUrl = `${this.baseUrl}/posts?&`;

        // Define parameters.
        let params = new HttpParams()
            .set('per_page', perPage.toString())
            .set('page', (page + 1).toString())
            .set('search', search)
            .set('_embed', 'true')
            .set('filter[meta_key]', 'portfolio_only')
            .set('filter[meta_value]', '0');

        if (tags.length > 0 && tags[0] !== '') {
            params = params.set('tags', tags.join(','));
        }
        if (categories.length > 0 && categories[0] !== '') {
            params = params.set('categories', categories.join(','));
        }

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
        search: string = '',
        tags: string[] = [],
        categories: string[] = []
    ): Observable<number> {
        // Define the full URL.
        const requestUrl = `${this.baseUrl}/posts?&`;

        // Define parameters.
        let params = new HttpParams()
            .set('per_page', '1')
            .set('filter[meta_key]', 'portfolio_only')
            .set('filter[meta_value]', '0')
            .set('search', search);

        if (tags.length > 0 && tags[0] !== '') {
            params = params.set('tags', tags.join(','));
        }
        if (categories.length > 0 && categories[0] !== '') {
            params = params.set('categories', categories.join(','));
        }

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
                            posts[i] = new PostWithOptions(
                                data,
                                post['show_role_date'],
                                post['show_role_title'],
                                post['show_role_organisation'],
                                post['is_expanded']
                            );
                        }
                    );
                    break;
                case 'anecdote':
                    // Make new anecdote post.
                    posts[i] = new PostWithOptions(
                            new AnecdotePost(
                                PostType.ANECDOTE,
                                null,
                                null,
                                null,
                                post['anecdote']
                            ),
                            null,
                            null,
                            null,
                            null
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

        // Get tags.
        const tags: Tag[] = [];

        // Define the full URL.
        const tagRequestUrl = `${this.baseUrl}/tags/`;

        // Make request and mapping.
        if (!blob['_embedded']) {
            for (const tag of blob['tags']) {
                this.http
                .get(
                    tagRequestUrl + tag,
                    {
                        headers: this.headers
                    }
                )
                .subscribe(res => {
                    tags.push(new Tag(res['id'], res['slug']));
                });
            }
        } else {
            for (const term of blob['_embedded']['wp:term']) {
                for (const tag of term) {
                    if (tag['taxonomy'] === 'post_tag') {
                        tags.push(new Tag(tag['id'], tag['slug']));
                    }
                }
            }
        }

        // Get categories.
        const categories: Category[] = [];

        // Define the full URL
        const categoryRequestUrl = `${this.baseUrl}/categories/`;

        // Make request and mapping.
        if (!blob['_embedded']) {
            for (const category of blob['categories']) {
                this.http
                .get(
                    categoryRequestUrl + category,
                    {
                        headers: this.headers
                    }
                )
                .subscribe(res => {
                    tags.push(new Category(res['id'], res['slug']));
                });
            }
        } else {
            for (const term of blob['_embedded']['wp:term']) {
                for (const category of term) {
                    if (category['taxonomy'] === 'category') {
                        categories.push(new Category(category['id'], category['slug']));
                    }
                }
            }
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

        // Get the content.
        const postSections: PostSection[] = [];

        if (blob['acf']['content']) {
            for (const layout of blob['acf']['content']) {
                switch (layout['acf_fc_layout']) {
                    case 'text_block':
                        postSections.push(
                            new TextPostSection(PostSectionType.TEXT, this.domSanitizer.bypassSecurityTrustHtml(layout['content']))
                        );
                        break;
                    case 'image_block':
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

                        if (layout['image']['sizes']['medium']) {
                            image.urlSmall = layout['image']['sizes']['medium'];
                            image.srcSet += `${image.urlSmall} 300w, `;
                        }

                        if (layout['image']['sizes']['medium_large']) {
                            image.urlMedium = layout['image']['sizes']['medium_large'];
                            image.srcSet += `${image.urlMedium} 400w, `;
                        }

                        if (layout['image']['sizes']['large']) {
                            image.urlLarge = layout['image']['sizes']['large'];
                            image.srcSet += `${image.urlLarge} 1024w, `;
                        }

                        if (layout['image']['url']) {
                            image.urlFull = layout['image']['url'];
                            image.srcSet += `${image.urlFull} 1920w`;
                        }

                        image.title = layout['image']['title'];
                        image.altText = layout['image']['alt'];
                        image.caption = layout['image']['caption'];

                        postSections.push(
                            new ImagePostSection(
                                PostSectionType.IMAGE,
                                image
                            )
                        );
                        break;
                    case 'image_carousel':
                        const isAnimated = layout['is_animated'];
                        const items: ImageWithCaption[] = [];

                        for (const item of layout['items']) {
                            // Create the image.
                            const caption2: string = item['caption'];

                            const image2: any = {
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
                                image2.urlSmall = item['image']['sizes']['medium'];
                                image2.srcSet += `${image2.urlSmall} 300w, `;
                            }

                            if (item['image']['sizes']['medium_large']) {
                                image2.urlMedium = item['image']['sizes']['medium_large'];
                                image2.srcSet += `${image2.urlMedium} 400w, `;
                            }

                            if (item['image']['sizes']['large']) {
                                image2.urlLarge = item['image']['sizes']['large'];
                                image2.srcSet += `${image2.urlLarge} 1024w, `;
                            }

                            if (item['image']['url']) {
                                image2.urlFull = item['image']['url'];
                                image2.srcSet += `${image2.urlFull} 1920w`;
                            }

                            image2.title = item['image']['title'];
                            image2.altText = item['image']['alt'];
                            image2.caption = item['image']['caption'];

                            items.push(new ImageWithCaption(image2, caption2));
                        }

                        postSections.push(
                            new ImageCarouselPostSection(
                                PostSectionType.IMAGE_CAROUSEL,
                                new ImageCarousel(
                                    isAnimated,
                                    items
                                )
                            )
                        );
                        break;
                }
            }
        }

        let mp4: VideoSource;
        if (blob['acf']['mp4']) {
            mp4 = new VideoSource(
                blob['acf']['mp4']['url'],
                blob['acf']['mp4']['width'],
                blob['acf']['mp4']['height']
            );
        }

        let webm: VideoSource;
        if (blob['acf']['webm']) {
            webm = new VideoSource(
                blob['acf']['webm']['url'],
                blob['acf']['webm']['width'],
                blob['acf']['webm']['height']
            );
        }

        const featuredVideo = new Video(
            mp4,
            webm
        );

        return new BlogPost(
            PostType.BLOG,
            blob['id'],
            blob['date'],
            blob['modified'],
            blob['title']['rendered'],
            blob['excerpt']['rendered'],
            featureImage,
            postSections,
            tags,
            categories,
            related,
            classification,
            roleMetadata,
            featuredVideo
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
