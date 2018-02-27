import { Component } from '@angular/core';
import { ContentsService } from 'contents/contents.service';
import { AppConfiguration } from 'app/app.configuration';

@Component({
  selector: 'contents',
  templateUrl: '../../templates/contents/contents.component.html',
  providers: [
    ContentsComponent
  ]
})
export class ContentsComponent {
  constructor(
    private appConfiguration: AppConfiguration,
    private contentsService: ContentsService
  ) {}

  over(text: string) {
    this.contentsService.setText(text);
  }

  leave() {
    this.contentsService.resetText();
  }
}