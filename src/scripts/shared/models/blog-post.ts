import { Post, PostType } from './post';
import { Classification } from './classification';
import { RoleMetadata } from './role-metadata';

export class BlogPost extends Post {
    title: string;
    summary: string;
    featureImage: any;
    contents: string;
    tags: string[];
    related: BlogPost[];
    classification: Classification;
    roleMetadata: RoleMetadata;

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
        related: BlogPost[],
        classification: Classification,
        roleMetadata: RoleMetadata
    ) {
        super(type, id, dateCreated, dateEdited);

        this.title = title;
        this.summary = summary;
        this.featureImage = featureImage;
        this.contents = contents;
        this.tags = tags;
        this.related = related;
        this.classification = classification;
        this.roleMetadata = roleMetadata;
    }
}
