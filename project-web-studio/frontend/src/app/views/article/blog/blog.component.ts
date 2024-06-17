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
  // typesOfArticles: CategoryArticleType[] | DefaultResponseType = [];
  typesOfArticles: CategoryArticleType[] = [];
  //объект, который будет содержать ключи типа string и значения типа boolean
  categoryFilterStatus: { [key: string]: boolean } = {};

  constructor(private articleService: ArticleService) { }

  ngOnInit(): void {
    this.loadArticles();
    this.loadCategories();
  }

  loadArticles(): void {
    this.articleService.getArticles(1, ['dizain']).subscribe({
      next: (data: TopArticleType[] | any) => {
        this.articles = data;
      },
      error: (error: any) => {
        console.error('Произошла ошибка:', error);
      },
    });
  }

  loadCategories(): void {
    this.articleService.getCategoriesArticles().subscribe({
      next: (data: CategoryArticleType[] | DefaultResponseType) => {
        const errorData = data as DefaultResponseType;
        if (errorData.error !== undefined) {
          console.log(errorData.message)
        } else {
          const resultData = data as CategoryArticleType[];
          this.typesOfArticles = resultData.map(item => ({ ...item, isExpanded: false })); 
          console.log('CategoryArticleType', resultData);
          this.typesOfArticles = resultData;
        }
      },
      error: (error: any) => {
        console.error('Произошла ошибка:', error);
      },
    });
  }

  // filterByCategory(category: string, index: number) {
  //   this.typesOfArticles[index].isExpanded = !this.typesOfArticles[index].isExpanded; 
  //   this.articleService.getArticles(1, [category]).subscribe({
  //     next: (data: TopArticleType[] | any) => {
  //       this.articles = data;
  //       this.categoryFilterStatus[category] = true;
  //       console.log('Статьи с выбранной категорией:', this.articles);
  //     },
  //     error: (error: any) => {
  //       console.error('Произошла ошибка:', error);
  //     },
  //   });
  // }
  filterByCategory(category: string, index: number) {
    this.typesOfArticles[index].isExpanded = !this.typesOfArticles[index].isExpanded; 
    this.articleService.getArticles(1, [category]).subscribe({
      next: (data: any) => {
        this.articles = data.items; // Сохраняем отфильтрованные статьи в массив articles
        this.categoryFilterStatus[category] = true;
        console.log('Статьи с выбранной категорией:', this.articles);
      },
      error: (error: any) => {
        console.error('Произошла ошибка:', error);
      },
    });
  }
  
}
