import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleCardComponent } from './components/article-card/article-card.component';
import { ShortenDescriptionPipe } from './pipes/shorten-description.pipe';



@NgModule({
  declarations: [ArticleCardComponent, ShortenDescriptionPipe],
  imports: [
    CommonModule,
    
  ], 
  exports: [ArticleCardComponent]
})
export class SharedModule { }
