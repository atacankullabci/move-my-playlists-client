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
}
