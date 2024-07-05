import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';
import { ArticleService } from 'src/app/shared/services/article.service';
import { ArticleType } from 'src/types/top-articles.type';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  isOrder: boolean = false;
  isCallMeBack: boolean = false;

  private subscription: Subscription = new Subscription;

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true, // Включаем точки
    dotsEach: true, // Одинаковое количество точек, как и слайдов
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      }
    },
    nav: false
  }
  customOptionsReview: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 25,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      }
    },
    nav: false
  }

  topArticles: ArticleType[] = [];


  constructor(private articleService: ArticleService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.subscription.add(this.subscription?.add(this.articleService.getTopArticles()
      .subscribe({
        next: ((data: ArticleType[]) => {
          this.topArticles = data;
        }),
        error: ((error: any) => {
          console.error('An error occurred:', error);
        })
      })));
  }


  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    console.log('unsubscribe main-component');
  }

  openPopupOrder(orderTitle: string, placeholder: string, buttonText: string): void {
    this.isOrder = true;
    this.isCallMeBack = false;

    const dialogRef = this.dialog.open(PopupComponent, {
      data: {
        orderTitle: orderTitle,
        placeholder: placeholder,
        isCallMeBack: this.isCallMeBack,
        buttonText: buttonText
      }
    });
    console.log('dialogRefdialogRef', dialogRef)
    this.subscription.add(dialogRef.afterClosed().subscribe(() => {

      console.log('The popup was closed');
    }));
  }



}
