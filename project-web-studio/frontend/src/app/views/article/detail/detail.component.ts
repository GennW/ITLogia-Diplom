import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, catchError, forkJoin, of } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { ArticleService } from 'src/app/shared/services/article.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ArrayUtilsService } from 'src/app/utils/array-utils.service';
import { DateFormatService } from 'src/app/utils/date-format.service';
import { environment } from 'src/environments/environment';
import { CommentActionsType } from 'src/types/comment-actions.type';
import { CommentType } from 'src/types/comment.type';
import { DefaultResponseType } from 'src/types/default-response';
import { ArticleType } from 'src/types/top-articles.type';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit, OnDestroy {
  @ViewChild('commentTextElement') commentTextElement!: ElementRef;
  // для отписки от нескольких подписок
  private subscription: Subscription = new Subscription();

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
  isLoading: boolean = false;
  isAction: boolean = false;
  isLiked: boolean = false; // параметр для хранения информации о лайке
  isDisliked: boolean = false; // параметр для хранения информации о дизлайке

  constructor(
    private activatedRoute: ActivatedRoute,
    private articleService: ArticleService,
    private http: HttpClient,
    private authService: AuthService,
    private arrayUtilsService: ArrayUtilsService,
    public dateFormatService: DateFormatService,
    private snackBar: MatSnackBar,
    private loaderService: LoaderService
  ) {
    // запрашиваем первоначальное состояние пользователя
    this.isLogged = this.authService.getIsLogIn();
  }

  ngOnInit(): void {
    // актуальное состояние пользователя
    this.subscription.add(
      this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
        this.isLogged = isLoggedIn;
        // console.log('-------------------',this.isLogged, isLoggedIn)
      })
    );

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
      this.subscription.add(
        this.authService.getUserName().subscribe({
          next: (userData: { id: string }) => {
            // получаем id пользователя
            this.userId = userData.id;
            console.log('userId в компоненте DetailComponent:', this.userId);
          },
          error: () => {
            // this.authService.removeTokens();
            throw new Error('Ошибка userId');
          },
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    console.log('unsubscribe app-detail');
  }

  getArticle(): void {
    this.subscription.add(
      this.activatedRoute.params.subscribe((params) => {
        this.articleService
          .getArticleDetail(params['url'])
          .subscribe((data: any) => {
            this.article = data;
            this.getTopArticles();
            this.getComments(this.offsetValue, this.article.id);
          });
      })
    );
  }

  getTopArticles(): void {
    this.subscription.add(
      this.articleService.getTopArticles().subscribe({
        next: (data: ArticleType[]) => {
          const filterArticles = data.filter(
            (item) => item.url !== this.article.url
          );

          // перемешанный отфильтрованный массив статей
          const shuffledArticles =
            this.arrayUtilsService.shuffle(filterArticles);

          this.topArticles = shuffledArticles.slice(0, 2); // Вывести 2 статьи
        },
        error: (error: any) => {
          console.error('An error occurred:', error);
        },
      })
    );
  }

  // getComments(offset: number, articleId: string) {
  //   this.subscription.add(
  //     forkJoin([
  //       this.articleService.getComments(offset, articleId),
  //       this.articleService.getActions(articleId),
  //     ]).subscribe({
  //       next: ([comments, actions]: [CommentType, CommentActionsType[]]) => {
  //         this.prepareComments(comments);
  //         this.prepareActions(actions);
  //       },
  //     })
  //   );
  // }
  getComments(offset: number, articleId: string) {
    this.subscription.add(
      forkJoin([
        this.articleService.getComments(offset, articleId).pipe(
          catchError(error => {
            console.error('Ошибка при получении комментариев:', error);
            return of({ allCount: 0, comments: [] });
            // Возвращаем пустой список комментариев в случае ошибки
          })
        ),
        this.articleService.getActions(articleId).pipe(
          catchError(error => {
            console.error('Ошибка при получении действий комментариев:', error);
            return of([]);
            // Возвращаем пустой массив действий в случае ошибки
          })
        )
      ]).subscribe({
        next: ([comments, actions]: [CommentType, CommentActionsType[]]) => {
          this.prepareComments(comments);
          this.prepareActions(actions);
        },
      })
    );
  }

  prepareActions(actionsRes: CommentActionsType[]): void {
    this.response.comments.forEach(comment => {
      const actions = actionsRes.filter(action => action.comment === comment.id);
      if (actions.length) {
        actions.forEach(action => {
            if (action.action === 'like') {
                comment.isLikedByUser = true; // Устанавливаем, что пользователь поставил лайк
            }
            if (action.action === 'dislike') {
                comment.isDislikedByUser = true; // Устанавливаем, что пользователь поставил дизлайк
            }
        });
        console.log('actions for comment', comment.id, comment.isLikedByUser, comment.isDislikedByUser, actions);
      }
    });
}


  prepareComments(commentRes: CommentType): void {
    this.response = {
      allCount: commentRes.comments.length,
      comments: commentRes.comments.map((comment) => {
      //   // Установка параметров для отслеживания реакций пользователя
      // if (comment.reaction === 'like') {
      //   comment.isLikedByUser = true;
      //   comment.isDislikedByUser = false;
      // } else if (comment.reaction === 'dislike') {
      //   comment.isDislikedByUser = true;
      //   comment.isLikedByUser = false;
      // } else {
      //   comment.isLikedByUser = false;
      //   comment.isDislikedByUser = false;
      // }
        // Обновляем количества лайков и дизлайков, предусматривая возможность null значений
        comment.likesCount = comment.likesCount || 0;
        comment.dislikesCount = comment.dislikesCount || 0;
        return comment;
      }),
    };
    this.visibleComments = this.response.comments.slice(0, 3); // Отображаем только первые 3 комментария
  }

  loadMoreComments() {
    this.isLoading = true;
    this.loaderService.show();
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
      this.visibleComments.push(
        ...this.response.comments.slice(
          currentIndex,
          currentIndex + toDisplayCount
        )
      );
    }

    this.isLoading = false;
    this.loaderService.hide();
  }

  submitComment() {
    const text = this.commentTextElement.nativeElement.value;
    const articleId = this.article.id; //  идентификатор статьи

    if (text && articleId) {
      this.subscription.add(
        this.articleService.addComment(text, articleId).subscribe({
          next: (response: any) => {
            console.log('Комментарий успешно добавлен:', response);
            this.commentTextElement.nativeElement.value = ''; // Очистит текстовое поле
            this.getComments(this.offsetValue, articleId); // Обновит комментарии,
          },
          error: (error) => {
            console.error('Ошибка при добавлении комментария:', error);
          },
        })
      );
    } else {
      console.error(
        'Ошибка: Не удалось получить данные из текстового поля, токена доступа или идентификатора статьи.'
      );
    }
  }

  reactToComment(
    comment: CommentType['comments'][0],
    reaction: 'like' | 'dislike' | 'violate',
    userId: any
  ): void {
    if (this.isLogged) {
      if (reaction === 'violate') {
        this.subscription.add(
          this.articleService.reactionsComment(comment.id, reaction).subscribe({
            next: (response: DefaultResponseType) => {
              if (!response.error) {
                this.snackBar.open('Жалоба отправлена');
              } else {
                this.snackBar.open('Жалоба уже отправлена');
              }
            },
            error: () => {
              this.snackBar.open('Жалоба уже отправлена');
              console.error('Жалоба уже отправлена');
            },
          })
        );
      } else {
        // Проверка, была ли выбрана такая же реакция на комментарий
        if (comment.reaction === reaction && comment.reactedBy === userId) {
          // Если пользователь кликнул на уже выбранную реакцию, отменяем ее
          comment.reaction = null;
          if (reaction === 'like' && comment.likesCount > 0) {
            comment.likesCount--;
          } else if (reaction === 'dislike' && comment.dislikesCount > 0) {
            comment.dislikesCount--;
          }
          comment.reactedBy = null; // Сбрасываем идентификатор пользователя
          return;
        } else {
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
        this.subscription.add(
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
              // comment.isAction = true; 
            },
            error: (error) => {
              console.error(
                `Ошибка при отправке ${reaction} к комментарию:`,
                error
              );

              // Отменяем изменения в реакции в случае ошибки
              if (comment.reactedBy === userId) {
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
                comment.reactedBy = null;
              }
            },
          })
        );

        // Проверка, чтобы не уведичивать счетчик при повторном клике
        if (comment.reaction === reaction) {
          this.snackBar.open('Ваш голос учтен'); // Уведомление для пользователя
        }
      }
    } else {
      this.snackBar.open('Чтобы ставить реакции, зарегистрируйтесь');
    }
  }
}
