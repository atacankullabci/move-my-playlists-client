import {Component, Input, OnInit} from '@angular/core';
import {IUserInfo} from "../shared/user-info.model";

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {

  @Input()
  userInfo: IUserInfo;

  constructor() {
  }

  ngOnInit(): void {
  }

}
