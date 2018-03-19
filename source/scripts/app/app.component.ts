import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';

@Component({
  selector: 'app',
  templateUrl: '../../templates/app/app.component.html'
})
export class AppComponent {
  constructor(angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {}

  test(): void {
    console.log('Scrolled');
  }
}