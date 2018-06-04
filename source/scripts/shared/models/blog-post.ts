import { Post, PostType } from 'shared/models/post';

export class BlogPost extends Post {
    title: string;
    summary: string;
    featureImage: any;
    contents: string;
    tags: string[];
    isFeature: boolean;
    isPortfolio: boolean;
    inSeries: boolean;
    related: BlogPost[];

    constructor(
        type: PostType,
        id: string,
        dateCreated: string,
        dateEdited: string,
        title: string,
        summary: string,
        featureImage: any,
        contents: string,
        tags: string[],
        isFeature: boolean,
        isPortfolio: boolean,
        inSeries: boolean,
        related: BlogPost[]
    ) {
        super(type, id, dateCreated, dateEdited);

        this.title = title;
        this.summary = summary;
        this.featureImage = featureImage;
        this.contents = contents;
        this.tags = tags;
        this.isFeature = isFeature;
        this.isPortfolio = isPortfolio;
        this.inSeries = inSeries;
        this.related = related;
    }
}