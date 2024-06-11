import { Component, Input, OnInit } from '@angular/core';
import { TopArticleType } from 'src/types/top-articles.type';

@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent implements OnInit {
  @Input() topArticle!: TopArticleType;

  constructor() { }

  ngOnInit(): void {
  }

}
