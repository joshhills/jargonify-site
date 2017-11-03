import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

// Require base stylesheet.
const scss = require('../styles/style.scss');

// Initialise the module.
platformBrowserDynamic().bootstrapModule(AppModule);