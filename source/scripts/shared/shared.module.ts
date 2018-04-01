import { NgModule } from '@angular/core';

import { MockPostService, WordpressAPIPostService } from 'shared/services/post.service';
import { HistoryService } from './services/history.service';

@NgModule({
  providers: [
    MockPostService,
    WordpressAPIPostService,
    HistoryService
  ]
})
export class SharedModule { }
