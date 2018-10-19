import {Component, OnInit} from '@angular/core';

import {UserblockService} from './userblock.service';
import {SettingsService} from "../../../core/settings/settings.service";

@Component({
  selector: 'app-userblock',
  templateUrl: './userblock.component.html',
  styleUrls: ['./userblock.component.scss']
})
export class UserblockComponent implements OnInit {
  assistantManageState: number = 1016; //管理状态码
  user: any;

  constructor(public userblockService: UserblockService, private settings: SettingsService) {

    this.user = this.settings.user;
  }

  ngOnInit() {
  }

  userBlockIsVisible() {
    return this.userblockService.getVisibility();
  }

}
