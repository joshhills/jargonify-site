import { Post } from 'shared/models/post';

export class BlogPost extends Post {
    title: string;
    summary: string;
    featureImageUrl: string;
    contents: string;
    tags: string[];
    isFeature: boolean;
    isPortfolio: boolean;

    constructor(
        id: string,
        dateCreated: string,
        dateEdited: string,
        title: string,
        summary: string,
        featureImageUrl: string,
        contents: string,
        tags: string[],
        isFeature: boolean,
        isPortfolio: boolean
    ) {
        super(id, dateCreated, dateEdited);

        this.title = title;
        this.summary = summary;
        this.featureImageUrl = featureImageUrl;
        this.contents = contents;
        this.tags = tags;
    }
}