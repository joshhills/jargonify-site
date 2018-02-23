import { Post, PostType } from 'shared/models/post';
import { EndorsementPost } from 'shared/models/endorsement-post';

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
    ENDORSEMENT
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
    public posts: Post[];

    constructor(
        type: PortfolioSectionType,
        title: string,
        posts: Post[]
    ) {
        super(type);

        this.title = title;
        this.posts = posts;
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