import { Injectable } from '@angular/core';
import { Album, Artist, Track } from '@shared/interfaces/article';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ArtistsService {
  constructor(private _apiService: ApiService) {}

  getArtists(start: number): Observable<Artist[]> {
    return this._apiService.get(`artists?_start=${start}&_limit=999`);
  }

  addArtist(body: Artist): Observable<Artist> {
    return this._apiService.post(`artists`, body);
  }

  updateArtist(body: Artist): Observable<Artist> {
    return this._apiService.put(`artists/${body.id}`, body);
  }

  getTracks(start: number): Observable<any> {
    return this._apiService.get(`tracks?_start=${start}&_limit=999`);
  }

  addTracks(body: Track): Observable<Track> {
    return this._apiService.post(`tracks`, body);
  }

  updateTracks(body: Track): Observable<Track> {
    return this._apiService.put(`tracks/${body.id}`, body);
  }

  getAlbums(start: number): Observable<Album[]> {
    return this._apiService.get(`albums?_start=${start}&_limit=999`);
  }

  addAlbums(body: Album): Observable<Album> {
    return this._apiService.post(`albums`, body);
  }

  updateAlbums(body: Album): Observable<Album> {
    return this._apiService.put(`albums/${body.id}`, body);
  }
}
