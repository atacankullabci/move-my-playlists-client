import {Component, OnInit, ViewChild} from '@angular/core';
import {FileService} from "./file.service";
import {IpService} from "./ip.service";
import {IMediaContent, MediaContent} from "./media-content.model";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'im-movin-client';
  isMediaContentReceived = false;
  showSpinnerOverlay = false;
  clientIP: string;

  mediaContents: IMediaContent[];
  displayedColumns: string[] = ['trackName', 'artistName', 'albumName'];

  dataSource = new MatTableDataSource<MediaContent>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private fileService: FileService,
              private ipService: IpService) {
  }

  ngOnInit() {
    this.ipService.getIPAddress()
      .subscribe((response: any) => {
        this.clientIP = response.ip;
      });
  }

  prepareTable() {
    this.dataSource = new MatTableDataSource(this.mediaContents);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onFilePicked(event: Event) {
    this.showSpinnerOverlay = true;
    const file = (event.target as HTMLInputElement).files[0];
    this.fileService.sendFile(file, this.clientIP)
      .subscribe((response: IMediaContent[]) => {
        this.mediaContents = response;
        if (this.mediaContents) {
          this.isMediaContentReceived = true;
          this.showSpinnerOverlay = false;
        }
        this.prepareTable();
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  health() {
    this.fileService.checkHealth();
  }

  goToAuthPage() {
    window.location.href = 'https://accounts.spotify.com/authorize?response_type=code&client_id=b5ead0205230451d877d487a856a30a9&redirect_uri=http%3A%2F%2Fimovin.club%2Fcallback%2F&scope=user-library-modify';
  }
}
