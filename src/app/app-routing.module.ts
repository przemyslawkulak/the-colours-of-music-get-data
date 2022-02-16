import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ArticleListComponent } from './features/article-list/article-list.component';
import { ArtistsListComponent } from './features/artists-list/artists-list.component';

const routes: Routes = [
  {
    path: 'articlelist',
    component: ArticleListComponent,
  },
  {
    path: 'artistlist',
    component: ArtistsListComponent,
  },
  {
    path: '**',
    redirectTo: 'articlelist',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
