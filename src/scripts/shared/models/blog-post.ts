import { Post, PostType, PostSection } from './post';
import { Classification } from './classification';
import { RoleMetadata } from './role-metadata';
import { Tag } from './tag';
import { Category } from './category';
import { Video } from './video';

export class BlogPost extends Post {
    title: string;
    summary: string;
    featureImage: any;
    contents: PostSection[];
    tags: Tag[];
    categories: Category[];
    related: BlogPost[];
    classification: Classification;
    roleMetadata: RoleMetadata;
    featuredVideo: Video;

    constructor(
        type: PostType,
        id: string,
        dateCreated: string,
        dateEdited: string,
        title: string,
        summary: string,
        featureImage: any,
        contents: PostSection[],
        tags: Tag[],
        categories: Category[],
        related: BlogPost[],
        classification: Classification,
        roleMetadata: RoleMetadata,
        featuredVideo: Video
    ) {
        super(type, id, dateCreated, dateEdited);

        this.title = title;
        this.summary = summary;
        this.featureImage = featureImage;
        this.contents = contents;
        this.tags = tags;
        this.categories = categories;
        this.related = related;
        this.classification = classification;
        this.roleMetadata = roleMetadata;
        this.featuredVideo = featuredVideo;
    }
}
