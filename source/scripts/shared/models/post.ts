export abstract class Post {
    public id: string;
    public dateCreated: string;
    public dateEdited: string;

    constructor(
        id: string,
        dateCreated: string,
        dateEdited: string
    ) {
        this.id = id;
        this.dateCreated = dateCreated;
        this.dateEdited = dateEdited;
    }
}