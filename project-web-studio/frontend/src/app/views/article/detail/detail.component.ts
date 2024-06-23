import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from 'src/app/shared/services/article.service';
import { environment } from 'src/environments/environment';
import { CategoryArticleType } from 'src/types/categoties-articles.type copy';
import { CommentType } from 'src/types/comment.type';
import { ArticleType } from 'src/types/top-articles.type';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  // @Input() topArticle!: ArticleType;
  response!: CommentType;
  offsetValue = 1; // Пример значения для offset
  visibleComments!: any;
  hideLoadMoreClass: string = 'hidden';

  article!: ArticleType;
  topArticles: ArticleType[] = [];
  serverStaticPath = environment.serverStaticPath;


  constructor(private activatedRoute: ActivatedRoute, private articleService: ArticleService) { }

  ngOnInit(): void {

    this.articleService.getTopArticles()
      .subscribe({
        next: (data: ArticleType[]) => {

          this.topArticles = data.slice(0, 2); // Вывести 2 статьи
          // this.topArticles.forEach(item => console.log(item.id))

        },
        error: (error: any) => {
          console.error('An error occurred:', error);
        }
      });



    this.activatedRoute.params.subscribe(params => {
      this.articleService.getArticleDetail(params['url'])
        .subscribe((data: any) => {
          this.article = data;
          this.getComments(this.offsetValue, this.article.id);
        })
    })
  }


  getComments(offset: number, articleId: string) {
    this.articleService.getComments(offset, articleId).subscribe({
      next: (response: CommentType) => {
        // Обработка ответа, полученного от сервера
        this.response = {
          allCount: response.comments.length,  // Assuming allCount is the total count of comments
          comments: response.comments
        };
        this.visibleComments = response.comments.slice(0, 3);
        console.log('response====', this.response);
        console.log('articleId====', articleId);
      },
      error: (error) => {
        // Обработка ошибки, если запрос не удался
        console.error('Ошибка при получении комментариев:', error);
      }
    });
  }

  // loadMoreComments() {
  //   const currentIndex = this.visibleComments.length;
  //   const toDisplayCount = 3; 
  //   this.visibleComments.push(...this.response.comments.slice(currentIndex, currentIndex + toDisplayCount));
  // }
  loadMoreComments() {
    const currentIndex = this.visibleComments.length;
    const toDisplayCount = 3; 
    const remainingComments = this.response.comments.length - currentIndex;

    if (remainingComments <= toDisplayCount) {
        this.visibleComments.push(...this.response.comments.slice(currentIndex));
        // Проверяем, загружены ли все комментарии
        this.hideLoadMoreClass = 'hidden'; // Применяем класс, если все комментарии загружены
        console.log('hideLoadMoreClass = hidden');
        
    } else {
        this.visibleComments.push(...this.response.comments.slice(currentIndex, currentIndex + toDisplayCount));

    }
}


  formatDate(date: string): string {
    const commentDate = new Date(date);
    const day = ('0' + commentDate.getDate()).slice(-2);
    const month = ('0' + (commentDate.getMonth() + 1)).slice(-2);
    const year = commentDate.getFullYear();
    const hours = ('0' + commentDate.getHours()).slice(-2);
    const minutes = ('0' + commentDate.getMinutes()).slice(-2);

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }


}
