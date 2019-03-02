export class RoleMetadata {
    title: string;
    type: string;
    organisation: string;
    isCurrent: boolean;
    startDate: string;
    endDate: string;
    summary: string;
    responsibilities: string[];

    constructor(
        title: string,
        type: string,
        organisation: string,
        isCurrent: boolean,
        startDate: string,
        endDate: string,
        summary: string,
        responsibilities: string[]
    ) {
        this.title = title;
        this.type = type;
        this.organisation = organisation;
        this.isCurrent = isCurrent;
        this.startDate = startDate;
        this.endDate = endDate;
        this.summary = summary;
        this.responsibilities = responsibilities;
    }
}