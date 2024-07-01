import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { ArticleService } from 'src/app/shared/services/article.service';
import { ArrayUtilsService } from 'src/app/utils/array-utils.service';
import { DateFormatService } from 'src/app/utils/date-format.service';
import { environment } from 'src/environments/environment';
import { CommentType } from 'src/types/comment.type';
import { ArticleType } from 'src/types/top-articles.type';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  @ViewChild('commentTextElement') commentTextElement!: ElementRef;


  // @Input() topArticle!: ArticleType;
  response!: CommentType;
  offsetValue = 0; // Пример значения для offset
  visibleComments!: any;
  hideLoadMoreClass: string = '';
  isLogged: boolean = false;
  article!: ArticleType;
  topArticles: ArticleType[] = [];
  serverStaticPath = environment.serverStaticPath;
  accessToken: string | null = null;
  userId: string | null = null;


  constructor(private activatedRoute: ActivatedRoute, 
    private articleService: ArticleService, private http: HttpClient, 
    private authService: AuthService, private arrayUtilsService: ArrayUtilsService,
    public dateFormatService: DateFormatService, private snackBar: MatSnackBar) { 
      // запрашиваем первоначальное состояние пользователя
    this.isLogged = this.authService.getIsLogIn();
    }

  ngOnInit(): void {

    // актуальное состояние пользователя
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
      console.log('-------------------',this.isLogged, isLoggedIn)

      
    });

    // Получаем токен доступа из AuthService
    const tokens = this.authService.getTokens();
    // Доступ к токену доступа
    if (tokens) {
      this.accessToken = tokens.accessToken;
    } else {
      console.error('Token not found');
    }
    this.getArticle();
    
    if (this.isLogged) {
      this.authService.getUserName().subscribe({
        next: (userData: { id: string }) => {
          // получаем id пользователя
          this.userId = userData.id;
          console.log('userId в компоненте DetailComponent:',this.userId)
        },
        error: () => {
          // this.authService.removeTokens();
          throw new Error('Ошибка userId')
        }
      });
    }

  }

  getArticle(): void {

    this.activatedRoute.params.subscribe(params => {
      this.articleService.getArticleDetail(params['url'])
        .subscribe((data: any) => {
          this.article = data;
          this.getTopArticles();
          this.getComments(this.offsetValue, this.article.id);
        });
    });
  }

  getTopArticles(): void {
    this.articleService.getTopArticles()
    .subscribe({
      next: (data: ArticleType[]) => {
        const filterArticles = data.filter(item => item.url !== this.article.url )

        // перемешанный отфильтрованный массив статей
        const shuffledArticles = this.arrayUtilsService.shuffle(filterArticles);

        this.topArticles = shuffledArticles.slice(0, 2); // Вывести 2 статьи

      },
      error: (error: any) => {
        console.error('An error occurred:', error);
      }
    });
  }


  getComments(offset: number, articleId: string) {
    this.articleService.getComments(offset, articleId).subscribe({
        next: (response: CommentType) => {
            // Обработка ответа от сервера и обновление свойств likesCount и dislikesCount
            this.response = {
                allCount: response.comments.length,
                comments: response.comments.map(comment => {
                    // Обновляем количества лайков и дизлайков, предусматривая возможность null значений
                    comment.likesCount = comment.likesCount || 0;
                    comment.dislikesCount = comment.dislikesCount || 0;
                    return comment;
                })
            };
            this.visibleComments = this.response.comments.slice(0, 3); // Отображаем только первые 3 комментария

        },
        error: (error) => {
            // Обработка ошибки при запросе комментариев
            console.error('Ошибка при получении комментариев:', error);
        }
    });
}




  loadMoreComments() {
    // Узнаем текущее количество отображенных комментариев
    const currentIndex = this.visibleComments.length;
    // Количество комментариев, которые нужно показать при каждой загрузке
    const toDisplayCount = 3; 
    // Вычисляем сколько осталось незагруженных комментариев
    const remainingComments = this.response.comments.length - currentIndex;

 // Проверяем, осталось ли меньше или столько же комментариев, сколько нужно показать
    if (remainingComments <= toDisplayCount) {
      // Если осталось меньше или столько же, добавляем все оставшиеся комментарии
        this.visibleComments.push(...this.response.comments.slice(currentIndex));
        
        this.hideLoadMoreClass = 'hidden'; // Применяем класс, если все комментарии загружены
        
    } else {
      // Если осталось больше комментариев, добавляем еще несколько к уже отображенным
      //slice(currentIndex, currentIndex + toDisplayCount): Этот метод извлекает определенное количество комментариев из массива response.comments, начиная с индекса currentIndex и заканчивая индексом currentIndex + toDisplayCount
        this.visibleComments.push(...this.response.comments.slice(currentIndex, currentIndex + toDisplayCount));
    }
}

  submitComment() {
    const text = this.commentTextElement.nativeElement.value;
    const articleId = this.article.id; //  идентификатор статьи

    if (text && articleId) {
      this.articleService.addComment(text, articleId)
        .subscribe({
          next: (response: any) => {
            console.log('Комментарий успешно добавлен:', response);
            this.commentTextElement.nativeElement.value = ''; // Очистит текстовое поле
            this.getComments(this.offsetValue, articleId); // Обновит комментарии, 
          },
          error: (error) => {
            console.error('Ошибка при добавлении комментария:', error);
          }
        });
    } else {
      console.error('Ошибка: Не удалось получить данные из текстового поля, токена доступа или идентификатора статьи.');
    }
  }


  // Методs для отправки действия на сервер (лайк/дизлайк)
//   reactToComment(comment: any, reaction: 'like' | 'dislike'): void {
//     if (comment.reaction === reaction) {
//         // Если реакция уже была установлена, снимаем ее
//         comment.reaction = null;
//         // Уменьшаем или увеличиваем counts на сервере
//         if (reaction === 'like') {
//             comment.likesCount--;
//         } else if (reaction === 'dislike') {
//             comment.dislikesCount--;
//         }
//     } else {
//         // Устанавливаем новую реакцию
//         comment.reaction = reaction;
//         // Увеличиваем counts на сервере
//         if (reaction === 'like') {
//             comment.likesCount++;
//         } else if (reaction === 'dislike') {
//             comment.dislikesCount++;
//         }
//     }

//     // Отправляем запрос на сервер для обновления реакции
//     this.articleService.reactionsComment(comment.id, reaction).subscribe({
//         next: (response) => {
//             // Обработка успешного ответа от сервера
//             console.log('Реакция успешно обновлена:', response);

//             // Если ответ содержит количество лайков и дизлайков, можно их обновить в комментарии
//             if (response.likesCount !== undefined) {
//                 comment.likesCount = response.likesCount;
//             }
//             if (response.dislikesCount !== undefined) {
//                 comment.dislikesCount = response.dislikesCount;
//             }
//         },
//         error: (error) => {
//             console.error(`Ошибка при отправке ${reaction} к комментарию:`, error);
//             // В случае ошибки отменяем изменения в реакции, чтобы UI оставался согласованным
//             if (comment.reaction === reaction) {
//                 comment.reaction = null;
//             }
//         }
//     });
// }


reactToComment(comment: CommentType['comments'][0], reaction: 'like' | 'dislike', userId: any): void {
  if (comment.reaction === reaction && comment.reactedBy === userId) {
    // Если пользователь кликнул на текущую реакцию
    // и его реакция уже учтена, отменяем реакцию
    comment.reaction = null;
    if (reaction === 'like') {
      if (comment.likesCount > 0) {
        comment.likesCount--;
      }
    } else if (reaction === 'dislike') {
      if (comment.dislikesCount > 0) {
        comment.dislikesCount--;
      }
    }
    comment.reactedBy = null; // Сбрасываем идентификатор пользователя, чтобы можно было кликнуть снова
  } else {
    // Если реакция отличается от предыдущей или это новая реакция пользователя
    // Уменьшаем количество предыдущей реакции, если есть
    if (comment.reaction) {
      if (comment.reaction === 'like') {
        comment.likesCount--;
      } else if (comment.reaction === 'dislike') {
        comment.dislikesCount--;
      }
    }

    // Устанавливаем новую реакцию
    comment.reaction = reaction;
    // Увеличиваем соответствующее количество
    if (reaction === 'like') {
      comment.likesCount++;
    } else if (reaction === 'dislike') {
      comment.dislikesCount++;
    }
    comment.reactedBy = userId; // Устанавливаем идентификатор пользователя
  }

  // Отправляем запрос на обновление реакции на сервер
  this.articleService.reactionsComment(comment.id, reaction).subscribe({
    next: (response) => {
        // Обработка успешного ответа от сервера
        console.log('Реакция успешно обновлена:', response);
        if (response.likesCount !== undefined) {
            comment.likesCount = response.likesCount;
        }
        if (response.dislikesCount !== undefined) {
            comment.dislikesCount = response.dislikesCount;
        }
    },
    error: (error) => {
        console.error(`Ошибка при отправке ${reaction} к комментарию:`, error);

        // Отменяем изменения в реакции в случае ошибки
        if (comment.reactedBy === userId) {
            comment.reaction = null; // Сброс текущей реакции
            if (reaction === 'like') {
                if (comment.likesCount > 0) {
                    comment.likesCount--;
                }
            } else if (reaction === 'dislike') {
                if (comment.dislikesCount > 0) {
                    comment.dislikesCount--;
                }
            }
            comment.reactedBy = null; // Сброс идентификатора пользователя
        }
    }
  });
  if (comment.reaction === reaction) {
    this.snackBar.open('Ваш голос учтен');
  }
}



  
//   likeComment(commentId: string) {
//     this.articleService.reactionsComment(commentId, 'like').subscribe({
//       next: (response) => {
//         // Запрос успешно выполнен, обновляем состояние кнопок лайков и дизлайков
//         this.updateReactionStatus(commentId, 'like');
//       },
//       error: (error) => {
//         console.error('Ошибка при отправке лайка к комментарию:', error);
//       }
//     });
//   }
  
//   dislikeComment(commentId: string) {
//     this.articleService.reactionsComment(commentId, 'dislike').subscribe({
//       next: (response) => {
//           // Запрос успешно выполнен, обновляем состояние кнопок лайков и дизлайков
//           this.updateReactionStatus(commentId, 'dislike');
//       },
//       error: (error) => {
//         console.error('Ошибка при отправке дизлайка к комментарию:', error);
//       }
//     });
//   }
//   updateReactionStatus(commentId: string, action: string) {
//     const targetComment = this.response.comments.find((comment) => comment.id === commentId);

//     if (targetComment) {
//         if (action === 'like') {
//             targetComment.reaction = targetComment.reaction === 'like' ? null : 'like'; // Устанавливаем лайк, если его не было, иначе снимаем
//             if (targetComment.reaction === 'dislike') {
//                 targetComment.reaction = 'like'; // Если был установлен дизлайк, меняем на лайк
//             }
//         } else if (action === 'dislike') {
//             targetComment.reaction = targetComment.reaction === 'dislike' ? null : 'dislike'; // Устанавливаем дизлайк, если его не было, иначе снимаем
//             if (targetComment.reaction === 'like') {
//                 targetComment.reaction = 'dislike'; // Если был установлен лайк, меняем на дизлайк
//             }
//         }
//     } else {
//         console.error('Комментарий не найден');
//     }
// }





}
