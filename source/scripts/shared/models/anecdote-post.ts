import { Post, PostType } from 'shared/models/post';

export class AnecdotePost extends Post {
    text: string;

    constructor(
        type: PostType,
        id: string,
        dateCreated: string,
        dateEdited: string,
        text: string,
    ) {
        super(type, id, dateCreated, dateEdited);

        this.text = text;
    }
}