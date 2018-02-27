import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ContentsComponent } from 'contents/contents.component';
import { ContentsService } from 'contents/contents.service';

@NgModule({
  declarations: [
    ContentsComponent
  ],
  imports: [
    RouterModule
  ],
  exports: [
    ContentsComponent
  ],
  providers: [
    ContentsService
  ]
})
export class ContentsModule { }
