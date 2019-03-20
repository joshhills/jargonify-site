export class Video {
    mp4: VideoSource;
    webm: VideoSource;

    constructor(
        mp4: VideoSource,
        webm: VideoSource
    ) {
        this.mp4 = mp4;
        this.webm = webm;
    }
}

export class VideoSource {
    url: string;
    width: number;
    height: number;

    constructor(
        url: string,
        width: number,
        height: number
    ) {
        this.url = url;
        this.width = width;
        this.height = height;
    }
}
