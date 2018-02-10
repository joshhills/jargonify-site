import { NgModule } from '@angular/core';

import { MockPostService } from 'shared/services/post.service';

@NgModule({
  providers: [
    MockPostService
  ]
})
export class SharedModule { }
