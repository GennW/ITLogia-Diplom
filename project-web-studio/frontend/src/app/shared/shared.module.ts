import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleCardComponent } from './components/article-card/article-card.component';
import { ShortenDescriptionPipe } from './pipes/shorten-description.pipe';
import { LoaderComponent } from './components/loader/loader.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'; 



@NgModule({
  declarations: [ArticleCardComponent, ShortenDescriptionPipe, LoaderComponent],
  imports: [
    CommonModule,
    MatProgressSpinnerModule
    
  ], 
  exports: [ArticleCardComponent, ShortenDescriptionPipe, LoaderComponent]
})
export class SharedModule { }
