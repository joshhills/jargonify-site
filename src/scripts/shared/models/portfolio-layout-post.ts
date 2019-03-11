import { Post, PostType } from '../models/post';
import { EndorsementPost } from '../models/endorsement-post';
import { ImageCarousel } from './image-carousel';

export class PortfolioLayoutPost extends Post {
    public headerText: string;
    public sections: PortfolioSection[] = [];

    constructor(
        type: PostType,
        id: string,
        dateCreated: string,
        dateEdited: string,
        headerText: string,
        sections: PortfolioSection[]
    ) {
        super(type, id, dateCreated, dateEdited);

        this.headerText = headerText;
        this.sections = sections;
    }
}

export enum PortfolioSectionType {
    POST_LIST,
    TEXT_BLOCK,
    ENDORSEMENT,
    IMAGE_CAROUSEL
}

export class PortfolioSection {
    public type: PortfolioSectionType;

    constructor(
        type: PortfolioSectionType,
    ) {
        this.type = type;
    }
}

export class PostListPortfolioSection extends PortfolioSection {
    public title: string;
    public posts: PostWithOptions[];

    constructor(
        type: PortfolioSectionType,
        title: string,
        posts: PostWithOptions[]
    ) {
        super(type);

        this.title = title;
        this.posts = posts;
    }
}

export class PostWithOptions {
    public post: Post;
    public showRoleDate: boolean;
    public showRoleTitle: boolean;
    public showRoleOrganisation: boolean;
    public isExpanded: boolean;

    constructor(
        post: Post,
        showRoleDate: boolean,
        showRoleTitle: boolean,
        showRoleOrganisation: boolean,
        isExpanded: boolean
    ) {
        this.post = post;
        this.showRoleDate = showRoleDate;
        this.showRoleTitle = showRoleTitle;
        this.showRoleOrganisation = showRoleOrganisation;
        this.isExpanded = isExpanded;
    }
}

export class TextBlockPortfolioSection extends PortfolioSection {
    public theme: string;
    public content: any[];

    constructor(
        type: PortfolioSectionType,
        theme: string,
        content: any[]
    ) {
        super(type);

        this.theme = theme;
        this.content = content;
    }
}

export class EndorsementPortfolioSection extends PortfolioSection {
    public endorsements: EndorsementPost[];

    constructor(
        type: PortfolioSectionType,
        endorsements: EndorsementPost[]
    ) {
        super(type);

        this.endorsements = endorsements;
    }
}

export class ImageCarouselSection extends PortfolioSection {
    public imageCarousel: ImageCarousel;

    constructor(
        type: PortfolioSectionType,
        imageCarousel: ImageCarousel
    ) {
        super(type);

        this.imageCarousel = imageCarousel;
    }
}
