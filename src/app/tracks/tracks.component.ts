import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {IMediaContent, MediaContent} from "../shared/media-content.model";
import {FileService} from "../file.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {DialogComponent} from "../shared/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.css']
})
export class TracksComponent implements OnInit {

  @Input()
  userId: string;
  mediaContents: IMediaContent[] = [];
  selectedGenreList: string[] = [];
  chips = [];

  dataSource = new MatTableDataSource<MediaContent>();
  displayedColumns: string[] = ['trackName', 'artistName', 'albumName', 'genre'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  migrationCompleted: boolean = false;

  constructor(private fileService: FileService,
              private dialog: MatDialog) {
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

  migrate() {
    const dialogRef = this.dialog.open(DialogComponent);

    dialogRef.afterClosed()
      .subscribe((res) => {
        if (res) {
          this.migrationCompleted = true;
          this.fileService.migrateTracks(this.userId)
            .subscribe((resp) => {
              if (resp) {
                this.migrationCompleted = false;
              }
            });
        }
      })
  }

  chipSelected(event) {
    const chipName = event.source.value;
    if (event.selected) {
      this.selectedGenreList.push(chipName);
    } else {
      const index = this.selectedGenreList.indexOf(chipName, 0);
      this.selectedGenreList.splice(index, 1);
    }
    console.log(this.selectedGenreList);
  }

  genreChips(mediaContents: IMediaContent[]) {
    let set = new Set<string>();
    mediaContents.forEach((mediaContent) => {
      if (mediaContent.genre !== ' ') {
        set.add(mediaContent.genre);
      }
    })
    const genreList: Set<String> = set;

    genreList.forEach((genre) => {
      this.chips.push({state: false, name: genre})
    })
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
