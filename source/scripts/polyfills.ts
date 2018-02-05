// Add polyfills here...
import 'core-js/es6';
import 'core-js/es7/reflect';
require('zone.js/dist/zone');

import { enableProdMode } from '@angular/core';

if (process.env.ENV === 'production') {
  enableProdMode();
} else {
  Error['stackTraceLimit'] = Infinity;
  require('zone.js/dist/long-stack-trace-zone');
}