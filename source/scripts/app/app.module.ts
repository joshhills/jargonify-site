// Angular Modules
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { CookieService } from 'ngx-cookie-service';

// Custom Modules
import { AboutModule } from 'about/about.module';
import { BlogModule } from 'blog/blog.module';
import { ContentsModule } from 'contents/contents.module';
import { ErrorModule } from 'error/error.module';
import { HomeModule } from 'home/home.module';
import { PatternModule } from 'pattern/pattern.module';
import { PortfolioModule } from 'portfolio/portfolio.module';
import { PostModule } from 'post/post.module';
import { AppRoutingModule } from 'app/app-routing.module';
import { SharedModule } from 'shared/shared.module';
import { SpineModule } from 'spine/spine.module';

// Configuration
import { AppComponent } from  'app/app.component';
import { AppConfiguration } from 'app/app.configuration';

@NgModule({
  imports: [
    // Angular Modules
    BrowserModule,
    FormsModule,
    HttpModule,
    // External Modules
    Angulartics2Module.forRoot([Angulartics2GoogleAnalytics]),
    // Custom Modules
    AboutModule,
    AppRoutingModule,
    BlogModule,
    ContentsModule,
    ErrorModule,
    HomeModule,
    PatternModule,
    PortfolioModule,
    PostModule,
    SharedModule,
    SpineModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    AppConfiguration,
    CookieService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}