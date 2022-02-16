import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  constructor(private _apiService: ApiService) {}

getArticles(): Observable<any>{
  return this._apiService.get('articles?_limit=1000')
}
}
