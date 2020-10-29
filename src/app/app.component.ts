import {Component, OnInit, ViewChild} from '@angular/core';
import {FileService} from "./file.service";
import {IpService} from "./ip.service";
import {IMediaContent, MediaContent} from "./shared/media-content.model";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {ActivatedRoute} from "@angular/router";
import {IUserInfo} from "./shared/user-info.model";
import {UserService} from "./user.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "./shared/dialog/dialog.component";

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
  contentBadge = 0;
  isUserValid: boolean = false;
  userId: string;
  migrationCompleted: boolean = false;

  userInfo: IUserInfo;

  mediaContents: IMediaContent[];
  displayedColumns: string[] = ['trackName', 'artistName', 'albumName', 'genre'];

  dataSource = new MatTableDataSource<MediaContent>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private route: ActivatedRoute,
              private fileService: FileService,
              private ipService: IpService,
              private userService: UserService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.userId = params['id'];
        this.userService.checkUser(this.userId)
          .subscribe((response) => {
            if (response.status === 200) {
              this.userInfo = response.body;
              this.isUserValid = true;
            } else {
              this.userInfo.userImage = null;
              this.isUserValid = false;
            }
          });
      }
    });

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
    if (this.userId) {
      this.fileService.sendFile(file, this.clientIP, this.userId)
        .subscribe((response: IMediaContent[]) => {
          this.mediaContents = response;
          if (this.mediaContents) {
            this.isMediaContentReceived = true;
            this.showSpinnerOverlay = false;
          }
          this.contentBadge = this.mediaContents.length;
          this.prepareTable();
        });
    }
  }

  migrate() {
    const dialogRef = this.dialog.open(DialogComponent);

    dialogRef.afterClosed()
      .subscribe((res) => {
        if (res) {
          this.showSpinnerOverlay = true;
          this.fileService.migrate(this.userId)
            .subscribe((resp) => {
              if (resp) {
                this.migrationCompleted = true;
                this.showSpinnerOverlay = false;
              }
            });
        }
      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  goToAuthPage() {
    window.location.href = 'https://accounts.spotify.com/authorize?response_type=code&client_id=b5ead0205230451d877d487a856a30a9&redirect_uri=http%3A%2F%2Fimovin.club%2Fcallback%2F&scope=user-library-modify';
  }
}
