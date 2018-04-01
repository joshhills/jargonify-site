import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HistoryService {
    private navigatedWithinApp: boolean = false;

    constructor() {}

    public setNavigatedWithinApp(navigatedWithinApp: boolean) {
        this.navigatedWithinApp = navigatedWithinApp;
    }

    public isNavigatedWithinApp(): Observable<boolean> {
        return Observable.of(this.navigatedWithinApp);
    }
}