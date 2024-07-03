import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ArticleService } from 'src/app/shared/services/article.service';
import { CategoryArticleType } from 'src/types/categoties-articles.type copy';
import { DefaultResponseType } from 'src/types/default-response';
import { ArticleType } from 'src/types/top-articles.type';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})


export class BlogComponent implements OnInit, OnDestroy {
  articles: ArticleType[] = [];
  typesOfArticles: CategoryArticleType[] = [];
  //объект, который будет содержать ключи типа string и значения типа boolean
  categoryFilterStatus: { [key: string]: boolean } = {};
  categories: string[] = [];
  filterOpen = false;
  appliedFilters: string[] = [];
  pages: number[] = [];
  currentPage: number = 1;
  
  // для отписки от нескольких подписок
  private subscription: Subscription = new Subscription();

  constructor(private articleService: ArticleService, private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
   this.subscription.add(this.activatedRoute.queryParams.subscribe(params => {
    // Извлекаем параметр 'page' из запроса и преобразуем в число, устанавливаем значение по умолчанию - 1
    this.currentPage = Number(params['page'] || 1);
    
    // Проверяем наличие параметра 'filters' в запросе
    if (params['filters']) {
        // Если 'filters' существует, разбиваем его на массив фильтров по запятым и сохраняем в appliedFilters
        this.appliedFilters = params['filters'].split(',');
    } 
    // Загружаем статьи с учетом текущей страницы и выбранных фильтров
    this.loadArticles(this.currentPage);
    this.updateAppliedFilters();
}));

    // Загружаем категории статей
    this.loadCategories();
}

ngOnDestroy(): void {
  this.subscription.unsubscribe();
  console.log('unsubscribe')
}

  loadArticles(page: number): void {
    this.subscription.add(this.articleService.getArticles(page, this.appliedFilters).subscribe({
      next: (data: {count: number, pages: number, items: ArticleType[]}) => {
        this.articles = data.items;
        this.pagination(data);
        
      },
      error: (error: any) => {
        console.error('Произошла ошибка:', error);
      },
    }));
  }


  loadCategories(): void {
    this.subscription.add(this.articleService.getCategoriesArticles().subscribe({
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
    }));
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


    // Обновляем параметры запроса URL с новыми appliedFilters
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { filters: this.appliedFilters.join(','),
      page: 1
      }, // Преобразуем массив в строку с разделителем
      queryParamsHandling: 'merge',
  });
  // После обновления параметров запроса, загружаем статьи с учетом выбранных фильтров
  // this.loadArticles(this.currentPage);
  this.updateAppliedFilters();
  }

  updateAppliedFilters() {
    this.categoryFilterStatus = {};
    this.appliedFilters.forEach((filter) => {
      this.categoryFilterStatus[filter] = true;
    });
  }

  getFilterName(url: string): string | undefined {
    const foundFilter = this.typesOfArticles.find(item => item.url === url);
  
    if (foundFilter) {
      return foundFilter.name;
    } else {
      console.log('Не найдено имя фильтра для URL: ' + url);
    }
    return undefined;
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

// Метод перехода на предыдущую страницу
navigatePrevious(): void {
  if (this.currentPage > 1) {
    this.goToPage(this.currentPage - 1);
  }
}

// Метод перехода на следующую страницу
navigateNext(): void {
  if (this.currentPage < this.pages.length) {
    this.goToPage(this.currentPage + 1);
  }
}


// Метод для перехода на определенную страницу с использованием параметров запроса
goToPage(page: number): void {
  //  метод navigate роутера для перехода на ту же самую страницу с обновленными параметрами запроса
  this.router.navigate([], {
    // Определение параметров запроса, которые нужно обновить в URL
    queryParams: { page: page },
    // Указание режима обработки существующих параметров запроса при добавлении новых
    queryParamsHandling: 'merge',
    // Указание, что навигация относительно текущего активного маршрута
    relativeTo: this.activatedRoute
  });
}


}
