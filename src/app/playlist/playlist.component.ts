import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {IPlaylist} from "../shared/playlist.model";
import {MatTableDataSource} from "@angular/material/table";
import {IMediaContent, MediaContent} from "../shared/media-content.model";
import {MatPaginator} from "@angular/material/paginator";
import {FileService} from "../file.service";

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {

  playlist: IPlaylist[];
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  dataSource = new MatTableDataSource<MediaContent>();
  displayedColumns: string[] = ['trackName', 'artistName', 'albumName', 'genre'];

  constructor(private fileService: FileService) {
  }

  ngOnInit(): void {
    this.fileService.getMediaContents()
      .subscribe((response) => {
        this.playlist = response;
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
