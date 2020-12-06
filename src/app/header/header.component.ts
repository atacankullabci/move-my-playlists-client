import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {DisclaimerDialogComponent} from "../shared/disclaimer-dialog/disclaimer-dialog.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  openDialog() {
    this.dialog.open(DisclaimerDialogComponent);
  }

  redirect() {
    window.location.href = 'https://atacankullabci.com';
  }

  tweetIt() {
    window.location.href = 'https://twitter.com/intent/tweet?text=Hi%20!%20I%20found%20a%20site%20that%20moves%20your%20entire%20iTunes%20library%20to%20your%20Spotify%20account.%20You%20might%20wanna%20check%20it%20out%20!%0Amovemyplaylists.com'
  }

  reloadPage() {
    window.location.href = 'https://movemyplaylists.com';
  }
}
