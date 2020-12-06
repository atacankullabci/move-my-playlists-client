import {Component, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {IPlaylist} from "../playlist.model";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {IMediaContent} from "../media-content.model";
import {MatDialog} from "@angular/material/dialog";
import {MatCheckboxChange} from "@angular/material/checkbox";

@Component({
  selector: 'app-multi-ds-table',
  templateUrl: './multi-ds-table.component.html',
  styleUrls: ['./multi-ds-table.component.css']
})
export class MultiDsTableComponent implements OnInit {

  @Input()
  userId: string;
  @Input()
  playlist: IPlaylist[];
  @Input()
  withCheckBoxHeader: boolean;
  checkedPlaylists: IPlaylist[] = [];
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  dataSource = new MatTableDataSource<IMediaContent>();
  displayedColumns: string[] = ['trackName', 'artistName', 'albumName', 'genre'];
  migrationStarted: boolean = false;

  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  playlistChecked(playlist: IPlaylist, event: MatCheckboxChange) {
    if (event.checked) {
      this.checkedPlaylists.push(playlist);
    } else {
      const index = this.checkedPlaylists.indexOf(playlist, 0);
      this.checkedPlaylists.splice(index, 1);
    }
  }

  panelOpened(playlistName: string) {
    const mediaContents = this.filter(this.playlist, playlistName);
    this.dataSource = new MatTableDataSource(mediaContents);
    this.dataSource.paginator = this.paginator.toArray()[this.findIndex(this.playlist, playlistName)];
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
