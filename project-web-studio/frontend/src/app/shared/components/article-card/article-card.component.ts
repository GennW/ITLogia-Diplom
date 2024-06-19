import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TopArticleType } from 'src/types/top-articles.type';

@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent implements OnInit, AfterViewInit {
  @Input() topArticle!: TopArticleType;
  @Input() articles!: TopArticleType;

  serverStaticPath = environment.serverStaticPath;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }
  
  // Обрезаем текст до n знаков и добавляем "..."
  getShortenedDescription(description: string): string {   
    if (description && description.length > 100) {
      return description.substring(0, 100) + '...';
    } else {
      return description; 
    }
  }


}
