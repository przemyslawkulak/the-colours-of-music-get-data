import { Component, OnInit } from '@angular/core';
import { Article } from '@shared/interfaces/article';
import { ArticlesService } from '@shared/services/articles.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'the-colours-of-music';
  showFiller = false;
  opened = false;
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
