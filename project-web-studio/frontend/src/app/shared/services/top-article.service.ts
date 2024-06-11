import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TopArticleType } from 'src/types/top-articles.type';

@Injectable({
  providedIn: 'root'
})
export class TopArticleService {

  constructor(private http: HttpClient) { }

  getTopArticles(): Observable<TopArticleType[]> {
    return this.http.get<TopArticleType[]>(environment.api + 'articles/top')
  }
}
