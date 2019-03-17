import { Pipe, PipeTransform } from '@angular/core';
import { PostSection, PostSectionType, TextPostSection } from '../models/post';

@Pipe({name: 'readtime'})
export class ReadTime implements PipeTransform {
    transform(content: PostSection[]): number {
        // Compute the estimated read time based on content.
        let numWords = 0;

        for (const section of content) {
            if (section.type === PostSectionType.TEXT) {
                numWords += (section as TextPostSection).content.trim().split(/\s+/).length;
            }
        }

        // Based on average adult read time per minute.
        const estimatedMinutes: number = Math.round(numWords / 250);

        return estimatedMinutes > 0 ? estimatedMinutes : 1;
    }
}
