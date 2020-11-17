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

  reloadPage() {
    window.location.reload();
  }
}
