import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from 'app.module';

// Require base stylesheet.
const scss = require('../styles/main.scss');

// Initialise the module.
platformBrowserDynamic().bootstrapModule(AppModule);