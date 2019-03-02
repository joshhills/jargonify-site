export class ImageCarousel {
    public isAnimated: boolean;
    public items: ImageWithCaption[];

    constructor(
        isAnimated: boolean,
        items: ImageWithCaption[]
    ) {
        this.isAnimated = isAnimated;
        this.items = items;
    }
}

export class ImageWithCaption {
    public image: any;
    public caption: string;

    constructor(
        image: any,
        caption: string
    ) {
        this.image = image;
        this.caption = caption;
    }
}