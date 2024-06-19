import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CategoryArticleType } from 'src/types/categoties-articles.type copy';
import { DefaultResponseType } from 'src/types/default-response';
import { ArticleType } from 'src/types/top-articles.type';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) { }

  getTopArticles(): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/top')
  }

  getCategoriesArticles(): Observable<CategoryArticleType[] | DefaultResponseType> {
    return this.http.get<CategoryArticleType[] | DefaultResponseType>(environment.api + 'categories')
  }

  getArticles(page: number, categories: string[] = []): Observable<{count: number, pages: number, items: ArticleType[]}> {

    let params = `page=${page}`;
    categories.forEach(category => {
      params += `&categories=${category}`;
    })

    // Добавляем параметры запроса к URL
    const url = `${environment.api}articles?${params}`;

    return this.http.get<{count: number, pages: number, items: ArticleType[]}>(url);
  }
  
  getArticle(): Observable<{count: number, pages: number, items: ArticleType[]}> {
    return this.http.get<{count: number, pages: number, items: ArticleType[]}>(environment.api + 'articles')
  }

  getArticleDetail(url: string) {
    return this.http.get(`${environment.api}/articles/${url}`);
  }
}
