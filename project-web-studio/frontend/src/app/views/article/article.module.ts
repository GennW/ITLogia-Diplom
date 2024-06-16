import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleRoutingModule } from './article-routing.module';
import { BlogComponent } from './blog/blog.component';
import { DetailComponent } from './detail/detail.component';
import { ArticleCardComponent } from 'src/app/shared/components/article-card/article-card.component';
import { FormsModule } from '@angular/forms';
import { AppModule } from 'src/app/app.module';


@NgModule({
  declarations: [
    BlogComponent,
    DetailComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ArticleRoutingModule
  ], 
  // exports: [BlogComponent]
})
export class ArticleModule { }
