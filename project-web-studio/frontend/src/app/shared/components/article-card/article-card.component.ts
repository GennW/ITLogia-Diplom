import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TopArticleType } from 'src/types/top-articles.type';

@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent implements OnInit {
  @Input() topArticle!: TopArticleType;
  @Input() articles!: TopArticleType;

  serverStaticPath = environment.serverStaticPath;

  constructor() { }

  ngOnInit(): void {
  }

}
