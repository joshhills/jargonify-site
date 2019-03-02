import { Component } from '@angular/core';
import { ContentsService } from '../contents/contents.service';
import { AppConfiguration } from '../app/app.configuration';

@Component({
  selector: 'spine',
  templateUrl: '../../templates/spine/spine.component.html'
})
export class SpineComponent {
  title: string;

  constructor(
    private appConfiguration: AppConfiguration,
    private contentsService: ContentsService
  ) {
    this.title = appConfiguration.HOME_TEXT;

    contentsService.getText().subscribe(
      data => {
        this.title = data;
      }
    );
  }
}
