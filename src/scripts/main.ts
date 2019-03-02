import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from '../environments/environment';

import { snooper } from './snooper';

if (environment.production) {
  enableProdMode();
}

// Say hello to curious eyes...
console.log('%c%s', snooper.css, snooper.message);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
