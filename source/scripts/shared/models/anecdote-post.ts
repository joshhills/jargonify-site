import { Post } from 'shared/models/post';

export class AnecdotePost extends Post {
    text: string;
    isPortfolio: boolean;

    constructor(
        id: string,
        dateCreated: string,
        dateEdited: string,
        text: string,
        isPortfolio: boolean
    ) {
        super(id, dateCreated, dateEdited);

        this.text = text;
        this.isPortfolio = isPortfolio;
    }
}