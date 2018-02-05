import { Injectable } from '@angular/core';

@Injectable()
export class AppConfiguration {
    // Immutable properties.
    public readonly MAX_BLOG_POSTS_PER_PAGE: number = 11;

    // Mutable properties.
    public doTrack: boolean = true;
}