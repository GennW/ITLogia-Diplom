import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CategoryArticleType } from 'src/types/categoties-articles.type copy';
import { CommentType } from 'src/types/comment.type';
import { DefaultResponseType } from 'src/types/default-response';
import { ArticleType } from 'src/types/top-articles.type';
import { UserRequestType } from 'src/types/user-request.type';

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

  getComments(offset: number, articleId: string): Observable<CommentType> {

    let params = `offset=${offset}&article=${articleId}`;
    const url = `${environment.api}comments?${params}`;

    return this.http.get<CommentType>(url);
  }

  addComment(text: string, articleId: string): Observable<CommentType> {
    const url = `${environment.api}comments`;
    

    // Создаем объект с данными для отправки
    const commentData = {
      text: text,
      article: articleId
    };

    // Отправляем POST запрос с данными комментария и заголовками
    return this.http.post<CommentType>(url, commentData);
  }
  
  getArticle(): Observable<{count: number, pages: number, items: ArticleType[]}> {
    return this.http.get<{count: number, pages: number, items: ArticleType[]}>(environment.api + 'articles')
  }

  getArticleDetail(url: string) {
    return this.http.get(`${environment.api}articles/${url}`);
  }



reactionsComment(commentId: string, action: string): Observable<any> {
  const url = `${environment.api}comments/${commentId}/apply-action`;
  
  // Создаем объект с данными для отправки
  const actionData = {
    action: action
  };

  // Устанавливаем заголовки
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  // Отправляем POST запрос с данными действия
  return this.http.post(url, actionData, { headers: headers });
}

    // Метод для отправки запроса от пользователя
  addUserRequest(userRequest: UserRequestType): Observable<DefaultResponseType> {
    const url = `${environment.api}requests`;

    // Отправляем POST запрос с данными запроса
    return this.http.post<DefaultResponseType>(url, userRequest);
  }
}
