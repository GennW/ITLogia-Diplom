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
    // Задаем для каждой категории начальное значение статуса фильтрации
    this.typesOfArticles.forEach(category => {
      this.categoryFilterStatus[category.url] = false;
    });

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
      next: (data: CategoryArticleType[]) => {
        // Инициализируем isExpanded для каждого элемента
        this.typesOfArticles = data.map(item => ({ ...item, isExpanded: false })); 
        console.log(data);
        this.typesOfArticles = data
      },
      error: (error: any) => {
        console.error('Произошла ошибка:', error);
      },
    });
  }

  filterByCategory(category: string, index: number) {
    // Меняем состояние isExpanded
    this.typesOfArticles[index].isExpanded = !this.typesOfArticles[index].isExpanded; 
    this.articleService.getArticles(1, [category]).subscribe({
      next: (data: TopArticleType[] | any) => {
        this.articles = data;
        // Обновляем статус фильтрации для выбранной категории
        //установить значение true для определенной категории
        this.categoryFilterStatus[category] = true;
        console.log('Статьи с выбранной категорией:', this.articles);
      },
      error: (error: any) => {
        console.error('Произошла ошибка:', error);
      },
    });
  }

}
