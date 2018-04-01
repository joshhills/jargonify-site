import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { HistoryService } from 'shared/services/history.service';

@Component({
  selector: 'app',
  templateUrl: '../../templates/app/app.component.html'
})
export class AppComponent {
  constructor(
    angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
    private router: Router,
    private historyService: HistoryService
  ) {
    this.router.events
    .filter(event => (event instanceof NavigationEnd))
        .take(2).skip(1).subscribe((routeData: any) => {
          this.historyService.setNavigatedWithinApp(true);
        });
  }
}