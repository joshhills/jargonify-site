import { Post, PostType } from 'shared/models/post';

export enum ContactType {
    EMAIL,
    URL
}

export class EndorsementPost extends Post {
    public fullName: string;
    public testimonial: string;
    public portraitImage: any;
    public contactType: ContactType;
    public contactDetails: string;

    constructor(
        type: PostType,
        id: string,
        dateCreated: string,
        dateEdited: string,
        fullName: string,
        testimonial: string,
        portraitImage: string,
        contactType: ContactType,
        contactDetails: string
    ) {
        super(type, id, dateCreated, dateEdited);

        this.fullName = fullName;
        this.testimonial = testimonial;
        this.portraitImage = portraitImage;
        this.contactType = contactType;
        this.contactDetails = contactDetails;
    }
}