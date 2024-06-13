import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';
import { TopArticleService } from 'src/app/shared/services/top-article.service';
import { TopArticleType } from 'src/types/top-articles.type';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  isOrder: boolean = false;

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

  topArticles: TopArticleType[] = [];
  

  constructor(private topArticleService: TopArticleService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.topArticleService.getTopArticles()
      .subscribe({
        next: ((data: TopArticleType[]) => {
          this.topArticles = data;
        }),
        error: ((error: any) => {
          console.error('An error occurred:', error);
        })
      });
   }
   
   openPopupOrder(orderTitle: string, placeholder: string): void {
    this.isOrder = true;
    const dialogRef = this.dialog.open(PopupComponent, {
      data: {
        orderTitle: orderTitle,
        placeholder: placeholder
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The popup was closed');
    });
  }



}
