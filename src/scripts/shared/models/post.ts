import { Entity } from './entity';
import { ImageCarousel, ImageWithCaption } from './image-carousel';
import { SafeHtml } from '@angular/platform-browser';

export abstract class Post extends Entity {
    public type: PostType;
    public dateCreated: string;
    public dateEdited: string;

    constructor(
        type: PostType,
        id: string,
        dateCreated: string,
        dateEdited: string
    ) {
        super(id);
        this.type = type;
        this.dateCreated = dateCreated;
        this.dateEdited = dateEdited;
    }
}

export enum PostType {
    BLOG,
    ANECDOTE,
    ENDORSEMENT,
    PORTFOLIO_LAYOUT
}

export enum PostSectionType {
    TEXT,
    IMAGE,
    IMAGE_CAROUSEL
}

export class PostSection {
    public type: PostSectionType;

    constructor(
        type: PostSectionType,
    ) {
        this.type = type;
    }
}

export class ImagePostSection extends PostSection {
    public image: any;

    constructor(
        type: PostSectionType,
        image: any
    ) {
        super(type);
        this.image = image;
    }
}

export class TextPostSection extends PostSection {
    public content: SafeHtml;

    constructor(
        type: PostSectionType,
        content: SafeHtml
    ) {
        super(type);
        this.content = content;
    }
}

export class ImageCarouselPostSection extends PostSection {
    public imageCarousel: ImageCarousel;

    constructor(
        type: PostSectionType,
        imageCarousel: ImageCarousel
    ) {
        super(type);
        this.imageCarousel = imageCarousel;
    }
}
