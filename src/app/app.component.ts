import {Component, OnInit} from '@angular/core';
import {FileService} from "./file.service";
import {IpService} from "./ip.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'im-movin-client';
  isMediaContentReceived = false;
  clientIP: string;

  constructor(private fileService: FileService,
              private ipService: IpService) {
  }

  ngOnInit() {
    this.ipService.getIPAddress()
      .subscribe((response: any) => {
        this.clientIP = response.ip;
      });
  }

  onFilePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    //this.fileService.addPost(file);
    this.fileService.sendFile(file);
  }

  health() {
    this.fileService.checkHealth();
  }

  goToAuthPage() {
    window.location.href = 'https://accounts.spotify.com/authorize?response_type=code&client_id=b5ead0205230451d877d487a856a30a9&redirect_uri=http%3A%2F%2Fimovin.club%2Fcallback%2F&scope=user-library-modify';
  }
}
