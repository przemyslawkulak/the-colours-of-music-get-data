import { Component, OnInit } from '@angular/core';
import { Article } from '@shared/interfaces/article';
import { ArticlesService } from '@shared/services/articles.service';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss'],
})
export class ArticleListComponent implements OnInit {
  articles: Article[];

  constructor(private _articlesService: ArticlesService) {}

  ngOnInit() {
    this.getAllArticles();
  }
  getAllArticles() {
    this._articlesService.getArticles().subscribe((response) => {
      this.articles = response;
    });
  }
}
