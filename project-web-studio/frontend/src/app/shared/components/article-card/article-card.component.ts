import {

  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { environment } from 'src/environments/environment';
import { ArticleType } from 'src/types/top-articles.type';
import { ArticleService } from '../../services/article.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss'],
})
export class ArticleCardComponent implements OnInit, OnDestroy {
  @Input() topArticle!: ArticleType;
  @Input() articles!: ArticleType;

  serverStaticPath = environment.serverStaticPath;
  private subscription: Subscription | null = null;


  constructor(private articleService: ArticleService, private router: Router) { }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    console.log('unsubscribe article-card');
  }

  onCardClick(article: any) {
    this.subscription = this.articleService.getArticleDetail(article.url).subscribe((data) => {
      
      this.router.navigate(['/detail', article.url]);
    });
  }
}
