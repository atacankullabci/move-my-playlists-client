import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FileService} from "./file.service";
import {IMediaContent} from "./shared/media-content.model";
import {ActivatedRoute, Router} from "@angular/router";
import {IUserInfo} from "./shared/user-info.model";
import {UserService} from "./user.service";
import {MatDialog} from "@angular/material/dialog";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {InProgressDialogComponent} from "./shared/in-progress-dialog/in-progress-dialog.component";
import {IPlaylist} from "./shared/playlist.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {REDIRECT_URI, SPOTIFY_CLIENT_ID, USER_SCOPES} from './app.constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  introPageShowed: boolean = true;
  title = 'im-movin-client';
  mediaContentCanBeAdded = false;
  isMediaContentReceived = false;
  showSpinnerOverlay = false;
  contentBadge = 0;
  playlistBadge = 0;
  userId: string;

  isUserValid: boolean = false;
  isUserInProgress: boolean = false;
  playlistOption: boolean = false;
  trackOption: boolean = false;
  playlistReceived: boolean = false;

  userInfo: IUserInfo;

  mediaContents: IMediaContent[];
  playlists: IPlaylist[];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private fileService: FileService,
              private userService: UserService,
              private dialog: MatDialog,
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
        this.fileService.sendFile(file, this.userId, this.playlistOption.toString())
          .subscribe((response: any) => {
            this.mediaContents = response[0];
            this.playlists = response[1];
            if (this.mediaContents) {
              this.isMediaContentReceived = this.trackOption;
              this.showSpinnerOverlay = false;
              this.contentBadge = this.mediaContents.length;
              this.fileService.setMediaContent(this.mediaContents);
            }
            if (this.playlists) {
              this.playlistReceived = true;
              this.showSpinnerOverlay = false;
              this.playlistBadge = this.playlists.length;
              this.fileService.setPlaylists(this.playlists);
            }
          }, (error: any) => {
            this.showSpinnerOverlay = false;
            this.snackBar.open(error.error.message, null, {
              duration: 3000
            });
          });
      }
    }
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

  goToAuthPage() {
    this.userService.getRandomState()
      .subscribe((state) => {
        window.location.href = 'https://accounts.spotify.com/authorize?' +
          'response_type=code&' +
          'client_id=' + SPOTIFY_CLIENT_ID + '&' +
          'redirect_uri=' + REDIRECT_URI + '&' +
          'scope=' + USER_SCOPES + '&' +
          'show_dialog=true&' +
          'state=' + state;
      })
  }

  start() {
    this.introPageShowed = false;
  }
}
