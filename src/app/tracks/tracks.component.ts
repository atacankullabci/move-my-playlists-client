import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {IMediaContent, MediaContent} from "../shared/media-content.model";
import {FileService} from "../file.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {DialogComponent} from "../shared/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {IPlaylist, Playlist} from "../shared/playlist.model";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.css']
})
export class TracksComponent implements OnInit {

  @Input()
  userId: string;
  mediaContents: IMediaContent[] = [];
  selectedPlaylists: IPlaylist[] = [];
  selectedGenreList: string[] = [];
  chips = [];

  transferSelected: boolean = false;
  transferType: string;

  dataSource = new MatTableDataSource<MediaContent>();
  displayedColumns: string[] = ['trackName', 'artistName', 'albumName', 'genre'];
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  migrationCompleted: boolean = false;

  constructor(private fileService: FileService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.fileService.getMediaContent()
      .subscribe((response) => {
        this.mediaContents = response;
        this.prepareTable();
        if (this.mediaContents) {
          this.genreChips(this.mediaContents);
        }
      });
  }

  genreChips(mediaContents: IMediaContent[]) {
    let set = new Set<string>();
    mediaContents.forEach((mediaContent) => {
      if (mediaContent.genre.trim().length > 0) {
        set.add(mediaContent.genre);
      }
    })
    const genreList: Set<String> = set;

    genreList.forEach((genre) => {
      this.chips.push({state: false, name: genre})
    })
  }

  migrate() {
    const dialogRef = this.dialog.open(DialogComponent);

    dialogRef.afterClosed()
      .subscribe((res) => {
        if (res) {
          this.migrationCompleted = true;
          if (this.transferType === 'track') {
            this.fileService.migrateTracks(this.userId)
              .subscribe((resp) => {
                if (resp) {
                  this.migrationCompleted = false;
                }
              });
          } else if (this.transferType === 'playlist') {
            this.fileService.migratePlaylists(this.userId, this.selectedPlaylists)
              .subscribe((responsePlaylists) => {
                const playlistNames = responsePlaylists.map(pl => pl.name.trim());
                const chipNames = this.chips.map(content => content.name.trim());
                const leftOverGenres = chipNames.filter(genre => playlistNames.indexOf(genre) < 0);
                this.chips = [];
                for (let lefOver of leftOverGenres) {
                  this.chips.push({state: false, name: lefOver})
                }

                this.snackBar.open(playlistNames.length > 1 ?
                  "Following playlists have been transferred : " + playlistNames :
                  "Following playlist has been transferred : " + playlistNames,
                  null,
                  {duration: 3000});

                this.selectedPlaylists = [];
                this.selectedGenreList = [];
                this.migrationCompleted = false;
              }, (error => {
                this.snackBar.open(error.error.message, null, {
                  duration: 3000
                });
                this.migrationCompleted = false;
              }));
          }
        }
      })
  }

  chipSelected(event) {
    debugger;
    this.dataSource.filter = '';

    const chipName = event.source.value.trim();
    if (chipName.length > 0) {
      if (event.selected) {
        this.selectedGenreList.push(chipName);
        this.populatePlaylists(chipName);
      } else {
        const index = this.selectedGenreList.indexOf(chipName, 0);
        this.selectedGenreList.splice(index, 1);
        this.selectedPlaylists.splice(index, 1);
      }
    }
  }

  populatePlaylists(genre: string) {
    this.selectedPlaylists.push(this.getPlaylistByGenre(genre, this.mediaContents));
  }

  getPlaylistByGenre(searchedGenre: string, mediaContentList: IMediaContent[]): IPlaylist {
    let mediaContents: IMediaContent[] = [];

    for (let mediaContent of mediaContentList) {
      if (mediaContent.genre.trim().toLowerCase() === searchedGenre.trim().toLowerCase()) {
        mediaContents.push(mediaContent);
      }
    }
    return new Playlist(searchedGenre, mediaContents);
  }

  selectTransferType(event) {
    this.transferType = event.value;
    this.transferSelected = true;
  }

  playlistSelected() {
    this.dataSource.filterPredicate = (data: IMediaContent, filter: string): boolean => {
      const textToSearch = data["genre"] && data["genre"].toLowerCase() || '';
      return textToSearch.trim().indexOf(filter.trim().toLowerCase()) !== -1;
    };
  }

  trackSelected() {
    this.prepareTable();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  prepareTable() {
    this.dataSource = new MatTableDataSource(this.mediaContents);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
