import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ArticleType } from 'src/types/top-articles.type';
import { ArticleService } from '../../services/article.service';
import { Router } from '@angular/router';

@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent implements OnInit, AfterViewInit {
  @Input() topArticle!: ArticleType;
  @Input() articles!: ArticleType;

  serverStaticPath = environment.serverStaticPath;

  constructor(private articleService: ArticleService, private router: Router) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }
  
  // Обрезаем текст до n знаков и добавляем "..."
  getShortenedDescription(description: string): string {   
    if (description && description.length > 100) {
      return description.substring(0, 100) + '...';
    } else {
      return description; 
    }
  }

  onCardClick(article: any) {
    this.articleService.getArticleDetail(article.url)
      .subscribe(data => {
        console.log(data)
        this.router.navigate(['/detail', article.url]);
      });
  }

}
