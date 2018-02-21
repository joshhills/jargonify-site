export abstract class Post {
    public type: PostType;
    public id: string;
    public dateCreated: string;
    public dateEdited: string;

    constructor(
        type: PostType,
        id: string,
        dateCreated: string,
        dateEdited: string
    ) {
        this.type = type;
        this.id = id;
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