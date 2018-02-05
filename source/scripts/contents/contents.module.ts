import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ContentsComponent } from './contents.component';

@NgModule({
  declarations: [
    ContentsComponent
  ],
  imports: [
    RouterModule
  ],
  exports: [
    ContentsComponent
  ]
})
export class ContentsModule { }
