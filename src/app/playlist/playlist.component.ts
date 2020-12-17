import {Component, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {IPlaylist} from "../shared/playlist.model";
import {MatTableDataSource} from "@angular/material/table";
import {IMediaContent, MediaContent} from "../shared/media-content.model";
import {MatPaginator} from "@angular/material/paginator";
import {FileService} from "../file.service";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../shared/dialog/dialog.component";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {

  @Input()
  userId: string;
  playlist: IPlaylist[] = [];
  checkedPlaylists: IPlaylist[] = [];
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  dataSource = new MatTableDataSource<MediaContent>();
  displayedColumns: string[] = ['trackName', 'artistName', 'albumName', 'genre'];
  migrationStarted: boolean = false;

  constructor(private route: ActivatedRoute,
              private fileService: FileService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.fileService.getPlaylists()
      .subscribe((response) => {
        this.playlist = response;
      })
  }

  playlistChecked(playlist: IPlaylist, event: MatCheckboxChange) {
    if (event.checked) {
      this.checkedPlaylists.push(playlist);
    } else {
      const index = this.checkedPlaylists.indexOf(playlist, 0);
      this.checkedPlaylists.splice(index, 1);
    }
  }

  migratePlaylists() {
    const dialogRef = this.dialog.open(DialogComponent);
    dialogRef.afterClosed()
      .subscribe((res) => {
        if (res) {
          this.migrationStarted = true;
          this.fileService.migratePlaylists(this.userId, this.checkedPlaylists)
            .subscribe((responsePlaylists) => {
              for (let pl of responsePlaylists) {
                const index = this.findIndex(this.playlist, pl.name);
                this.playlist.splice(index, 1);
                this.checkedPlaylists = [];
              }
              this.migrationStarted = false;

              const playlistNames = responsePlaylists.map(pl => pl.name);
              this.snackBar.open(playlistNames.length > 1 ?
                "Following playlists have been transferred : " + playlistNames :
                "Following playlist has been transferred : " + playlistNames,
                null,
                {duration: 3000});
            }, error => {
              this.snackBar.open(error.error.message, null, {
                duration: 3000
              });
              this.migrationStarted = false;
            });
        }
      })
  }

  panelOpened(playlistName: string) {
    this.fileService.getPlaylists()
      .subscribe((response) => {
        const mediaContents = this.filter(response, playlistName);
        this.dataSource = new MatTableDataSource(mediaContents);
        this.dataSource.paginator = this.paginator.toArray()[this.findIndex(response, playlistName)];
      });
  }

  findIndex(playlists: IPlaylist[], playlistName: string): number {
    for (let i = 0; i < playlists.length; i++) {
      if (playlists[i].name === playlistName) {
        return i;
      }
    }
  }

  filter(playlists: IPlaylist[], playlistName: string): IMediaContent[] {
    for (let playlist of playlists) {
      if (playlist.name === playlistName) {
        return playlist.mediaContents;
      }
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
