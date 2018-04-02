import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HistoryService {
    private navigatedWithinApp: boolean = false;
    private landedPortfolioLayoutId: string = null;

    constructor() {}

    public setNavigatedWithinApp(navigatedWithinApp: boolean) {
        this.navigatedWithinApp = navigatedWithinApp;
    }

    public isNavigatedWithinApp(): Observable<boolean> {
        return Observable.of(this.navigatedWithinApp);
    }

    public getLandedPortfolioLayoutId(): Observable<string> {
        return Observable.of(this.landedPortfolioLayoutId);
    }

    public setLandedPortfolioLayoutId(id: string): void {
        this.landedPortfolioLayoutId = id;
    }
}