import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleRoutingModule } from './article-routing.module';
import { BlogComponent } from './blog/blog.component';
import { DetailComponent } from './detail/detail.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    BlogComponent,
    DetailComponent,
    
  ],
  imports: [
    CommonModule,
    SharedModule,
    ArticleRoutingModule
  ],
  exports: [BlogComponent, DetailComponent]
})
export class ArticleModule { }
