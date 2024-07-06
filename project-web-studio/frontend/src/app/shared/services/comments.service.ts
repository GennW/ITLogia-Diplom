import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommentActionsType } from 'src/types/comment-actions.type';
import { CommentType } from 'src/types/comment.type';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http: HttpClient) { }

  

  getComments(offset: number, articleId: string): Observable<CommentType> {

    let params = `offset=${offset}&article=${articleId}`;
    const url = `${environment.api}comments?${params}`;

    return this.http.get<CommentType>(url);
  }

  getActions(articleId: string): Observable<CommentActionsType[]> {

    // let params = `offset=${offset}&article=${articleId}`;
    const url = `${environment.api}comments/article-comment-actions?articleId=${articleId}`;

    return this.http.get<CommentActionsType[]>(url);
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

}
