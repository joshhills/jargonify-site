import { NgModule } from '@angular/core';

import { WordpressAPIPostService } from '../shared/services/post.service';
import { HistoryService } from '../shared/services/history.service';
import { WindowService } from '../shared/services/window.service';
import { ReadTime } from '../shared/pipes/read-time.pipe';

@NgModule({
  providers: [
    WordpressAPIPostService,
    HistoryService,
    WindowService
  ],
  declarations: [
    ReadTime
  ],
  exports: [
    ReadTime
  ]
})
export class SharedModule { }