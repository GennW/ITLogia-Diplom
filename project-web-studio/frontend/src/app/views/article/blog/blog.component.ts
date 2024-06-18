import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  //объект, который будет содержать ключи типа string и значения типа boolean
  categoryFilterStatus: { [key: string]: boolean } = {};
  categories: string[] = [];
  filterOpen = false;
  appliedFilters: string[] = [];

  constructor(private articleService: ArticleService, private router: Router) { }

  ngOnInit(): void {

    this.loadArticles();
    this.loadCategories();
  }

  loadArticles(): void {
    this.articleService.getArticle().subscribe({
      next: (data: TopArticleType[] | any) => {
        this.articles = data.items;
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
          this.typesOfArticles = resultData;
          console.log('CategoryArticleType', resultData);
        }
      },
      error: (error: any) => {
        console.error('Произошла ошибка:', error);
      },
    });
  }


  // filterByCategory(category: string, index: number) {
  //   this.typesOfArticles[index].isExpanded = !this.typesOfArticles[index].isExpanded;
  //   // Проверяем, существует ли категория в списке categories
  //   const categoryIndex = this.categories.indexOf(category);
  // if (categoryIndex > -1) {
  //   // Если категория найдена, удаляем её из массива
  //   this.categories.splice(categoryIndex, 1);
  // } else {
  //   // Иначе добавляем категорию в массив
  //   this.categories.push(category);
  // }


  //   this.articleService.getArticles(1, this.categories).subscribe({
  //     next: (data: any) => {
  //       this.articles = data.items; // Сохраняем отфильтрованные статьи в массив articles
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

    const categoryIndex = this.appliedFilters.indexOf(category);
    if (categoryIndex > -1) {
      // Если категория уже выбрана, удаляем ее из списка
      this.appliedFilters.splice(categoryIndex, 1);
    } else {
      // Иначе добавляем категорию в список
      this.appliedFilters.push(category);
    }

    this.articleService.getArticles(1, this.appliedFilters).subscribe({
      next: (data: any) => {
        this.articles = data.items;
        this.updateAppliedFilters();
      },
      error: (error: any) => {
        console.error('Произошла ошибка:', error);
      },
    });
  }

  updateAppliedFilters() {
    this.categoryFilterStatus = {};
    this.appliedFilters.forEach((filter) => {
      this.categoryFilterStatus[filter] = true;
      this.appliedFilters.forEach(item => console.log(item));
      this.typesOfArticles.forEach(item => console.log(item.name));

    });
  }

  toggleFilter() {
    this.filterOpen = !this.filterOpen;
  }

  // updateFilterParam(url: string, checked: boolean) {
  //   this.router.navigate(['/article'], {
  //     queryParams:
  //   });
  // }

}
