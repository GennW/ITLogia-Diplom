import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/shared/services/article.service';
import { CategoryArticleType } from 'src/types/categoties-articles.type copy';
import { DefaultResponseType } from 'src/types/default-response';
import { TopArticleType } from 'src/types/top-articles.type';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  articles: TopArticleType[] = [];
  typesOfArticles: CategoryArticleType[] = [];

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.articleService.getArticles(1, ['dizain']).subscribe({
      next: (data: TopArticleType[] | any) => {
        this.articles = data;
        console.log(data.items);
        if (data.items.length > 0) {
          console.log('Статьи с определенной категорией:', this.articles);
        } else {
          console.log('Статьи с определенной категорией отсутствуют');
        }
      },
      error: (error: any) => {
        console.error('Произошла ошибка:', error);
      },
    });

    // получаеи категории
    this.articleService.getCategotiesArticles().subscribe({
      next: (data: CategoryArticleType[] | DefaultResponseType) => {
        console.log(data);
        this.typesOfArticles = data
      },
      error: (error: any) => {
        console.error('Произошла ошибка:', error);
      },
    });
  }
}
