import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

// External requirements.
const scss = require('../styles/style.scss');

if (process.env.ENV === 'production') {
    enableProdMode();
}

// Initialise the module.
platformBrowserDynamic().bootstrapModule(AppModule);
