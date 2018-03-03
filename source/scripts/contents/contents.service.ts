import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AppConfiguration } from 'app/app.configuration';

@Injectable()
export class ContentsService {
    private textSource: Subject<string> = new Subject<string>();
    private text: Observable<string> = this.textSource.asObservable();

    private fallback: string;
    private pathText: string;

    constructor(
        private appConfiguration: AppConfiguration,
        private router: Router
    ) {
        this.fallback = appConfiguration.HOME_TEXT;
        this.pathText = this.getFirstPath();

        this.textSource.next(this.pathText);

        // Subscribe to navigational changes.
        this.router.events.subscribe(
            data => {
                if (data instanceof NavigationEnd) {
                    this.pathText = this.getFirstPath(data.url);
                    this.setText(this.pathText);
                }
            }
        );
    }

    private getFirstPath(url: string = this.router.url): string {
        let split = url.split(/\/|\?/);

        if (split.length > 1 && split[1] !== '') {
            return split[1];
        } else {
            return this.fallback;
        }
    }

    public getText(): Observable<string> {
        return this.text;
    }

    public setText(text: string): void {
        this.textSource.next(text);
    }

    public resetText(): void {
        this.setText(this.pathText);
    }
}