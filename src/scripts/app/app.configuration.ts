import { Injectable } from '@angular/core';

@Injectable()
export class AppConfiguration {
    // Immutable properties.
    public readonly MAX_BLOG_POSTS_PER_PAGE: number = 10;
    public readonly HOME_TEXT: string = 'jargonify';

    // Mutable properties.
    public doTrack = true;
}
