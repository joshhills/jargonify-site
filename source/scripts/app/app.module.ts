// Angular Modules
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

// Custom Modules
import { BlogModule } from 'blog/blog.module';
import { BlurbModule } from 'blurb/blurb.module';
import { ContentsModule } from 'contents/contents.module';
import { ErrorModule } from 'error/error.module';
import { HomeModule } from 'home/home.module';
import { PatternModule } from 'pattern/pattern.module';
import { PortfolioModule } from 'portfolio/portfolio.module';
import { PostModule } from 'post/post.module';
import { AppRoutingModule } from 'app/app-routing.module';
import { SpineModule } from 'spine/spine.module';

// Custom services.
import { PostService } from 'shared/services/post.service';

import { AppComponent } from  'app/app.component';
import { AppConfiguration } from 'app/app.configuration';

// Configuration


@NgModule({
  imports: [
    // Angular Modules
    BrowserModule,
    FormsModule,
    HttpModule,
    // Custom Modules
    AppRoutingModule,
    BlogModule,
    BlurbModule,
    ContentsModule,
    ErrorModule,
    HomeModule,
    PatternModule,
    PortfolioModule,
    PostModule,
    SpineModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    AppConfiguration,
    PostService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}