import {Component, OnInit, ViewChild} from '@angular/core';
import {FileService} from "./file.service";
import {IpService} from "./ip.service";
import {IMediaContent, MediaContent} from "./shared/media-content.model";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {ActivatedRoute, Router} from "@angular/router";
import {IUserInfo} from "./shared/user-info.model";
import {UserService} from "./user.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "./shared/dialog/dialog.component";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {InProgressDialogComponent} from "./shared/in-progress-dialog/in-progress-dialog.component";
import {IPlaylist} from "./shared/playlist.model";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  introPageShowed: boolean = true;
  title = 'im-movin-client';
  mediaContentCanBeAdded = false;
  isMediaContentReceived = false;
  showSpinnerOverlay = false;
  clientIP: string;
  contentBadge = 0;
  playlistBadge = 0;
  userId: string;

  isUserValid: boolean = false;
  migrationCompleted: boolean = false;
  isUserInProgress: boolean = false;
  playlistOption: boolean = false;
  trackOption: boolean = false;
  playlistReceived: boolean = false;

  userInfo: IUserInfo;

  mediaContents: IMediaContent[];
  playlists: IPlaylist[];
  displayedColumns: string[] = ['trackName', 'artistName', 'albumName', 'genre'];

  dataSource = new MatTableDataSource<MediaContent>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private fileService: FileService,
              private ipService: IpService,
              private userService: UserService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['error']) {
        this.snackBar.open("User did not accept the request", null, {
          duration: 3000
        });
        return
      }
      if (params['id']) {
        this.userId = params['id'];
        this.userService.checkUser(this.userId)
          .subscribe((response) => {
            if (response.status === 200) {
              this.start();
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

  parseSelections() {
    this.mediaContentCanBeAdded = this.playlistOption || this.trackOption;
  }

  onFilePicked(event: Event) {
    if (this.isUserInProgress) {
      this.dialog.open(InProgressDialogComponent);
    } else {
      this.showSpinnerOverlay = true;
      const file = (event.target as HTMLInputElement).files[0];
      if (this.userId) {
        this.fileService.sendFile(file, this.clientIP, this.userId, this.playlistOption.toString())
          .subscribe((response: any) => {
            this.mediaContents = response[0];
            this.playlists = response[1];
            if (this.mediaContents) {
              this.isMediaContentReceived = this.trackOption;
              this.showSpinnerOverlay = false;
              this.contentBadge = this.mediaContents.length;
            }
            if (this.playlists) {
              this.playlistReceived = true;
              this.showSpinnerOverlay = false;
              this.playlistBadge = this.playlists.length;
              this.fileService.setMediaContents(this.playlists);
            }
            this.prepareTable();
          }, (error: any) => {
            this.showSpinnerOverlay = false;
            this.snackBar.open(error.error.message, null, {
              duration: 3000
            });
          });
      }
    }
  }

  migrate() {
    const dialogRef = this.dialog.open(DialogComponent);

    dialogRef.afterClosed()
      .subscribe((res) => {
        if (res) {
          this.showSpinnerOverlay = true;
          this.fileService.migrateTracks(this.userId)
            .subscribe((resp) => {
              if (resp) {
                this.migrationCompleted = true;
                this.showSpinnerOverlay = false;
              }
            });
        }
      })
  }

  checkUserProgress() {
    this.userService.getUserProgress(this.userId)
      .subscribe((response) => {
        this.isUserInProgress = response.body;
      })
  }

  onTabClick(event: MatTabChangeEvent) {
    if (event.index === 1) {
      this.checkUserProgress();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  goToAuthPage() {
    this.userService.getRandomState()
      .subscribe((state) => {
        window.location.href = 'https://accounts.spotify.com/authorize?' +
          'response_type=code&' +
          'client_id=b5ead0205230451d877d487a856a30a9&' +
          'redirect_uri=http%3A%2F%2Fmovemyplaylists.com%2Fcallback%2F&' +
          'scope=user-library-modify,playlist-modify-public&' +
          'show_dialog=true&' +
          'state=' + state;
      })
  }

  start() {
    this.introPageShowed = false;
  }
}
