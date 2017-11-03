import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from 

const appRoutes: Routes = [
  {
    path: 'pattern',
    component: PatternComponent
  }
];

@NgModule({
  imports: [
    // Enable routing.
    RouterModule.forRoot(
      appRoutes
    ),
    BrowserModule,
    FormsModule
  ],
  declarations: [
    PatternComponent
  ],
  bootstrap: [ ]
})
export class AppModule { }