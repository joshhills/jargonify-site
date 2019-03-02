import { filter, take, skip } from 'rxjs/operators';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { HistoryService } from '../shared/services/history.service';

@Component({
  selector: 'app',
  templateUrl: '../../templates/app/app.component.html'
})
export class AppComponent {
  @ViewChild('bleed') bleed: ElementRef;

  constructor(
    angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
    private router: Router,
    private historyService: HistoryService
  ) {
    angulartics2GoogleAnalytics.startTracking();
    this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd))
      .pipe(
        take(2))
        .pipe(skip(1)).subscribe((routeData: any) => {
          this.historyService.setNavigatedWithinApp(true);
        });
  }
}