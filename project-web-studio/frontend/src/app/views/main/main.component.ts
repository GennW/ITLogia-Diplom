import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { TopArticleService } from 'src/app/shared/services/top-article.service';
import { TopArticleType } from 'src/types/top-articles.type';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
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

  constructor(private topArticleService: TopArticleService) { }

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
   

}
