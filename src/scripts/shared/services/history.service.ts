import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class HistoryService {
    private navigatedWithinApp = false;
    private landedPortfolioLayoutId: string = null;

    constructor() {}

    public setNavigatedWithinApp(navigatedWithinApp: boolean) {
        this.navigatedWithinApp = navigatedWithinApp;
    }

    public isNavigatedWithinApp(): Observable<boolean> {
        return of(this.navigatedWithinApp);
    }

    public getLandedPortfolioLayoutId(): Observable<string> {
        return of(this.landedPortfolioLayoutId);
    }

    public setLandedPortfolioLayoutId(id: string): void {
        this.landedPortfolioLayoutId = id;
    }
}
