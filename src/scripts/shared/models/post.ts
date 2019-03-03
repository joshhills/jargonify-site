import { Entity } from './entity';

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
