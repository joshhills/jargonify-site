export class Classification {
    isFeature: boolean;
    isCollection: boolean;
    portfolioOnly: boolean;

    constructor(
        isFeature: boolean,
        isCollection: boolean,
        portfolioOnly: boolean
    ) {
        this.isFeature = isFeature;
        this.isCollection = isCollection;
        this.portfolioOnly = portfolioOnly;
    }
}