import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Artist } from '@shared/interfaces/article';
import { ArtistsService } from '@shared/services/artists.service';

@Component({
  selector: 'app-artists-list',
  templateUrl: './artists-list.component.html',
  styleUrls: ['./artists-list.component.scss'],
})
export class ArtistsListComponent implements OnInit, AfterViewInit {
  artists: MatTableDataSource<Artist>;

  ddartists: Artist[];
  displayedColumns: string[] = ['position', 'displayName', 'Described', 'articles', 'tracks', 'top100'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _artistsService: ArtistsService) {}

  ngOnInit() {
    this.getAllArtists();
    this._artistsService.getTracks(0).subscribe((res) => {
      console.log(res);
    });
  }

  ngAfterViewInit() {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.artists.filter = filterValue.trim().toLowerCase();

    if (this.artists.paginator) {
      this.artists.paginator.firstPage();
    }
  }

  getAllArtists() {
    this._artistsService.getArtists(0).subscribe((response) => {
      this.artists = new MatTableDataSource(response);
      this.artists.paginator = this.paginator;
      this.artists.sort = this.sort;
      this.ddartists = response;
      // console.log(response);
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.ddartists, event.previousIndex, event.currentIndex);
  }
}
