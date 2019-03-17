import { NgModule } from '@angular/core';

import { WordpressAPIPostService } from '../shared/services/post.service';
import { HistoryService } from '../shared/services/history.service';
import { WindowService } from '../shared/services/window.service';
import { ReadTime } from '../shared/pipes/read-time.pipe';
import { ImageCarouselComponent } from './components/image-carousel.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    LazyLoadImageModule,
    CommonModule
  ],
  providers: [
    WordpressAPIPostService,
    HistoryService,
    WindowService
  ],
  declarations: [
    ReadTime,
    ImageCarouselComponent
  ],
  exports: [
    ReadTime,
    ImageCarouselComponent
  ]
})
export class SharedModule { }
