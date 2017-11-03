import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { PatternModule } from '../pattern/pattern.module';
import { PatternComponent } from '../pattern/pattern.component';

import { AppComponent } from  './app.component';

const appRoutes: Routes = [
  {
    path: 'pattern',
    component: PatternComponent
  },
  {
    path: '**',
    redirectTo: '/'
  }
];

@NgModule({
  imports: [
    // Enable routing.
    RouterModule.forRoot(
      appRoutes
    ),
    PatternModule,
    BrowserModule,
    FormsModule
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }