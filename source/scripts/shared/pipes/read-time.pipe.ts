import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'readtime'})
export class ReadTime implements PipeTransform {
    transform(content: string): number {
        // Compute the estimated read time based on content.
        let numWords: number = content.trim().split(/\s+/).length;

        // Based on average adult read time per minute.
        let estimatedMinutes: number = Math.round(numWords / 250);

        return estimatedMinutes > 0 ? estimatedMinutes : 1;
    }
}