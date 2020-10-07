import {Component} from '@angular/core';
import {FileService} from "./file.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'im-movin-client';

  constructor(private fileService: FileService) {
  }


  onFilePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.fileService.addPost(file);
  }

  goToAuthPage() {
    window.location.href = 'https://accounts.spotify.com/authorize?client_id=3b696f6fb5244a5e8dc40af0d20c6322&response_type=code&redirect_uri=https%3A%2F%2Fwww.atacankullabci.com&scope=user-library-modify';
  }
}
