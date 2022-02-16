import { Component, OnInit, ViewChild } from '@angular/core';
import { Album, Article, Artist, Track } from '@shared/interfaces/article';
import { TracksCSV } from '@shared/interfaces/song';
import { ArticlesService } from '@shared/services/articles.service';
import { ArtistsService } from '@shared/services/artists.service';
import { NgxCsvParser } from 'ngx-csv-parser';
import { NgxCSVParserError } from 'ngx-csv-parser';
import { forkJoin, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'the-colours-of-music';
  showFiller = false;
  opened = false;

  csvRecords: TracksCSV[] = [];
  allTracks: Track[] = [];
  allArticles: Article[] = [];
  allAlbums: Album[] = [];
  allArtists: Artist[] = [];
  header = true;

  constructor(
    private ngxCsvParser: NgxCsvParser,
    private articleService: ArticlesService,
    private artistsService: ArtistsService
  ) {}

  @ViewChild('csvInput', { static: false }) csvInput: any;

  ngOnInit(): void {}

  getCSV(files: FileList) {
    if (files && files.length > 0) {
      const file: File = files.item(0);

      this.ngxCsvParser
        .parse(file, { header: this.header, delimiter: ',' })
        .pipe(
          switchMap((csvResult: TracksCSV[]) => {
            this.csvRecords = csvResult;

            return forkJoin(
              this.articleService.getArticles(),
              this.artistsService.getArtists(0),
              this.artistsService.getArtists(999),
              this.artistsService.getTracks(0),
              this.artistsService.getTracks(999),

              this.artistsService.getAlbums(0),
              this.artistsService.getAlbums(999)
            );
          }),
          tap(([articles, artists1, artists2, tracks1, tracks2, albums1, albums2]) => {
            this.allArticles = articles;
            this.allArtists = [...artists1, ...this.allArtists];
            this.allArtists = [...artists2, ...this.allArtists];
            this.allTracks = [...tracks1, ...this.allTracks];
            this.allTracks = [...tracks2, ...this.allTracks];
            this.allAlbums = [...albums1, ...this.allAlbums];
            this.allAlbums = [...albums2, ...this.allAlbums];
          }),
          switchMap(([articles, artists, tracks, albums]) => {
            // this.extractArtists();
            // this.extractAlbums();
            this.extractTracks();
            return of(null);
          })
        )
        .subscribe(
          (csvResult: Array<any>) => {
            console.log('allArticles', this.allArticles, 'allTracks', this.allTracks, 'allAlbums', this.allAlbums);
          },
          (error: NgxCSVParserError) => {
            console.log('Error', error);
          }
        );
    }
  }

  extractArtists() {
    let addedCount = 0;
    let currentCount = 0;
    let artists = [];
    this.csvRecords.forEach((record) => {
      artists = [
        ...artists,
        ...record['Artist Name(s)'].split(',').map((a, i) => {
          return { 'Artist Name(s)': a.trim(), 'Artist URI(s)': record['Artist URI(s)'].split(',')[i] };
        }),
      ];
    });
    artists.forEach((record) => {
      // record['Artist Name(s)'].split(',')
      if (!this.allArtists.map((artist: Artist) => artist.displayName).includes(record['Artist Name(s)'])) {
        addedCount++;
        console.log('add Artist', record['Artist Name(s)'], addedCount);
        const addedArtist = {
          displayName: record['Artist Name(s)'],
          Top100: null,
          spotifyUrl: record['Artist URI(s)'],
          Described: false,
          created_at: new Date(),
          created_by: null,
          value: record['Artist Name(s)'].replace(/\s+/g, '-').toLowerCase(),
          updated_at: new Date(),
          updated_by: null,
        };
        this.allArtists.push(addedArtist);
        this.artistsService.addArtist(addedArtist).subscribe();
      } else {
        if (!this.allArtists.find((a) => a.displayName === record['Artist Name(s)']).spotifyUrl) {
          currentCount++;
          const artistToChange = this.allArtists
            .filter((a) => a.displayName === record['Artist Name(s)'])
            .map((b) => {
              b.spotifyUrl = record['Artist URI(s)'];
              return b;
            });
          this.artistsService.updateArtist(artistToChange[0]).subscribe();
          console.log('current Artist', record['Artist Name(s)'], currentCount);
        }
      }
    });
  }

  extractAlbums() {
    this.csvRecords.forEach((record) => {
      if (!this.allAlbums.map((a) => a.Title).includes(record['Album Name'])) {
        const addedAlbum: Album = {
          Title: record['Album Name'],
          tags: [],
          tracks: [],
          top200: null,
          described: false,
          artist: this.allArtists.filter((artist) => record['Album Artist Name(s)'].includes(artist.displayName)),
          releaseDate: record['Album Release Date'],
          spotifyUrl: record['Album URI'],
          imageUrl: record['Album Image URL'],
        };
        console.log('addedAlbum', addedAlbum);
        this.allAlbums.push(addedAlbum);
        this.artistsService.addAlbums(addedAlbum).subscribe();
      }
    });
  }

  extractTracks() {
    let addedCount = 0;
    let currentCount = 0;
    this.csvRecords.forEach((record) => {
      if (!this.allTracks.map((a) => a.Title).includes(record['Track Name'])) {
        addedCount++;
        const addedTrack: Track = {
          Duration: record['Track Duration (ms)'],
          Title: record['Track Name'],
          album: this.allAlbums.filter((album) => record['Album Name'].includes(album.Title)),
          artists: this.allArtists.filter((artist) => record['Album Artist Name(s)'].includes(artist.displayName)),
          created_at: new Date(),
          created_by: null,
          updated_at: new Date(),
          updated_by: null,
          spotifyUrl: record['Track URI'],
          youTubeUrl: null,
          discNumber: record['Disc Number'],
          trackNumber: record['Track Number'],
          trackPreviewURL: record['Track Preview URL'],
        };
        // console.log(addedTrack, addedCount);
        this.allTracks.push(addedTrack);
        this.artistsService.addTracks(addedTrack).subscribe();
      } else if (
        this.allTracks.find((a) => a.Title === record['Track Name']).id &&
        !this.allTracks.find((a) => a.Title === record['Track Name']).spotifyUrl
      ) {
        currentCount++;

        const updatedTrack = this.allTracks
          .filter((a) => a.Title === record['Track Name'])
          .map((b) => {
            b.spotifyUrl = record['Track URI'];
            b.Duration = record['Track Duration (ms)'];
            (b.album = b.album
              ? b.album
              : this.allAlbums.filter((album) => record['Album Name'].includes(album.Title))),
              (b.artists = b.artists
                ? b.artists
                : this.allArtists.filter((artist) => record['Album Artist Name(s)'].includes(artist.displayName)));
            (b.updated_by = null),
              (b.created_by = null),
              (b.youTubeUrl = null),
              (b.discNumber = record['Disc Number']),
              (b.trackNumber = record['Track Number']),
              (b.trackPreviewURL = record['Track Preview URL']);
            return b;
          });
        console.log(updatedTrack[0], currentCount);
        this.artistsService.updateTracks(updatedTrack[0]).subscribe();
      }
    });
  }
}
