import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleService } from 'src/app/shared/services/article.service';
import { CategoryArticleType } from 'src/types/categoties-articles.type copy';
import { DefaultResponseType } from 'src/types/default-response';
import { ArticleType } from 'src/types/top-articles.type';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})


export class BlogComponent implements OnInit {
  articles: ArticleType[] = [];
  typesOfArticles: CategoryArticleType[] = [];
  //объект, который будет содержать ключи типа string и значения типа boolean
  categoryFilterStatus: { [key: string]: boolean } = {};
  categories: string[] = [];
  filterOpen = false;
  appliedFilters: string[] = [];
  pages: number[] = [];
  currentPage: number = 1;

  constructor(private articleService: ArticleService, private router: Router) { }

  ngOnInit(): void {

    this.loadArticles(this.currentPage);
    this.loadCategories();
    

  }

  loadArticles(page: number): void {
    this.articleService.getArticles(page, this.appliedFilters).subscribe({
      next: (data: {count: number, pages: number, items: ArticleType[]}) => {
        this.articles = data.items;
        this.pagination(data);
      },
      error: (error: any) => {
        console.error('Произошла ошибка:', error);
      },
    });
  }

//   getShortenedDescription(description: string): string {   
//     if (description && description.length > 100) {
//         return description.substring(0, 100) + '...';
//     } else {
//         return description; 
//     }
// }

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
        }
      },
      error: (error: any) => {
        console.error('Произошла ошибка:', error);
      },
    });
  }
 
  
  filterByCategory(category: string, index: number) {
    // Получаем значение item.name из typesOfArticles
    const selectedCategory = this.typesOfArticles[index].name; 
    // console.log('selectedCategory====',selectedCategory)
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
        this.pagination(data);
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
    });
  }

  getFilterName(url: string): string | undefined {
    let filterName;
    const foundFilter = this.typesOfArticles.find(item => item.url === url);
    if (foundFilter) {
      filterName = foundFilter.name;
    } else {
      console.log('Не найдено имя фильтра')
    }
    
    return filterName;
  }

  toggleFilter() {
    this.filterOpen = !this.filterOpen;
  }

// пагинация
// Создаем метод для формирования массива страниц
pagination(data: {count: number, pages: number}): void {
  // Инициализируем массив страниц
  this.pages = [];

  // Заполняем массив значениями от 1 до data.pages
  for (let i = 1; i <= data.pages; i++) {
    this.pages.push(i);
  }
}



goToPage(page: number) {
  this.currentPage = page;
  // вызвать функцию для загрузки статей для текущей страницы
  this.loadArticles(this.currentPage);
}


onCardClick(article: ArticleType) {
  this.articleService.getArticleDetail(article.url)
    .subscribe(data => {
      console.log(data)
      this.router.navigate(['/detail', article.url]);
    });
}

}
