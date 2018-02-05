import { Post } from 'shared/models/post';

export class TestimonialPost extends Post {
    endorsement: string;
    personFullName: string;
    personImageUrl: string;
    personWorkplace: string;
    personContactEmail: string;

    constructor(
        id: string,
        dateCreated: string,
        dateEdited: string,
        text: string,
        endorsement: string,
        personFullName: string,
        personImageUrl: string,
        personWorkplace: string,
        personContactEmail: string
    ) {
        super(id, dateCreated, dateEdited);

        this.endorsement = endorsement;
        this.personFullName = personFullName;
        this.personImageUrl = personImageUrl;
        this.personWorkplace = personWorkplace;
        this.personContactEmail = personContactEmail;
    }
}