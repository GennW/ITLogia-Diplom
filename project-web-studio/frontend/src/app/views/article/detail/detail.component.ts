import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from 'src/app/shared/services/article.service';
import { environment } from 'src/environments/environment';
import { CategoryArticleType } from 'src/types/categoties-articles.type copy';
import { ArticleType } from 'src/types/top-articles.type';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  article!: ArticleType;
  serverStaticPath = environment.serverStaticPath;
  constructor(private activatedRoute: ActivatedRoute, private articleService: ArticleService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.articleService.getArticleDetail(params['url'])
      .subscribe((data: any) => {
        this.article = data;
      })
    })
    // console.log(this.articles)
  }

}
