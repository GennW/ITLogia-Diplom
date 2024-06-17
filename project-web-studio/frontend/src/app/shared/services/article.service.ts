import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CategoryArticleType } from 'src/types/categoties-articles.type copy';
import { DefaultResponseType } from 'src/types/default-response';
import { TopArticleType } from 'src/types/top-articles.type';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) { }

  getTopArticles(): Observable<TopArticleType[]> {
    return this.http.get<TopArticleType[]>(environment.api + 'articles/top')
  }

  getCategoriesArticles(): Observable<CategoryArticleType[] | DefaultResponseType> {
    return this.http.get<CategoryArticleType[] | DefaultResponseType>(environment.api + 'categories')
  }

  // getArticles(page: number, categories: string[] = []): Observable<TopArticleType[]> {
  //   // Формируем параметры запроса для категорий
  //   const params = new HttpParams()
  //   .set('page', page.toString())
  //   .set('categories', categories.join(','));

  //   // Добавляем параметры запроса к URL
  //   const url = `${environment.api}articles?${params}`;

  //   return this.http.get<TopArticleType[]>(url);
  // }
  getArticles(): Observable<{count: number, pages: number, items: TopArticleType[]}> {
    return this.http.get<{count: number, pages: number, items: TopArticleType[]}>(environment.api + 'articles')
  }
}