import { Post, PostType } from 'shared/models/post';

export class BlogPost extends Post {
    title: string;
    summary: string;
    featureImageUrl: string;
    contents: string;
    tags: string[];
    isFeature: boolean;
    isPortfolio: boolean;
    inSeries: boolean;

    constructor(
        type: PostType,
        id: string,
        dateCreated: string,
        dateEdited: string,
        title: string,
        summary: string,
        featureImageUrl: string,
        contents: string,
        tags: string[],
        isFeature: boolean,
        isPortfolio: boolean,
        inSeries: boolean
    ) {
        super(type, id, dateCreated, dateEdited);

        this.title = title;
        this.summary = summary;
        this.featureImageUrl = featureImageUrl;
        this.contents = contents;
        this.tags = tags;
        this.inSeries = inSeries;
    }
}