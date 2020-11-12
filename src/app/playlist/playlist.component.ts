import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {IPlaylist} from "../shared/playlist.model";
import {MatTableDataSource} from "@angular/material/table";
import {IMediaContent, MediaContent} from "../shared/media-content.model";
import {MatPaginator} from "@angular/material/paginator";
import {FileService} from "../file.service";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../shared/dialog/dialog.component";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {

  userId: string;
  playlist: IPlaylist[] = [];
  checkedPlaylists: IPlaylist[] = [];
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  dataSource = new MatTableDataSource<MediaContent>();
  displayedColumns: string[] = ['trackName', 'artistName', 'albumName', 'genre'];
  migrationStarted: boolean = false;

  constructor(private route: ActivatedRoute,
              private fileService: FileService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.userId = params['id'];
      }
    });

    this.fileService.getMediaContents()
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
            .subscribe(() => {
              this.migrationStarted = false;
            });
        }
      })
  }

  panelOpened(playlistName: string) {
    this.fileService.getMediaContents()
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
