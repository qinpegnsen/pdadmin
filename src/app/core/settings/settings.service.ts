import {Injectable} from '@angular/core';
import {RzhtoolsService} from "../services/rzhtools.service";
declare var $: any;

@Injectable()
export class SettingsService {

  public user: any;
  public app: any;
  public layout: any;
  static I18NINFO: any = {}; //国际化信息
  static custom:string = "Custom"; //自定义预约状态
  static zipFile:Array<string> = ['application/x-zip', 'application/zip', 'application/x-zip-compressed'];


  constructor(public tools:RzhtoolsService) {
    tools.getI18nInfos(); //获取国际化信息
    // User Settings
    // -----------------------------------
    this.user = {
      name: 'John',
      job: 'ng-developer',
      picture: 'assets/img/user/user.png'
    };

    // App Settings
    // -----------------------------------
    this.app = {
      name: 'Angle',
      description: 'Angular Bootstrap Admin Template',
      year: ((new Date()).getFullYear())
    };

    // Layout Settings
    // -----------------------------------
    this.layout = {
      isFixed: true,
      isCollapsed: false,
      isBoxed: false,
      isRTL: false,
      horizontal: false,
      isFloat: false,
      asideHover: false,
      theme: null,
      asideScrollbar: false,
      isCollapsedText: false,
      useFullLayout: false,
      hiddenFooter: false,
      offsidebarOpen: false,
      asideToggled: false,
      viewAnimation: 'ng-fadeInUp'
    };

  }

  getAppSetting(name) {
    return name ? this.app[name] : this.app;
  }

  getUserSetting(name) {
    return name ? this.user[name] : this.user;
  }

  getLayoutSetting(name) {
    return name ? this.layout[name] : this.layout;
  }

  setAppSetting(name, value) {
    if (typeof this.app[name] !== 'undefined') {
      this.app[name] = value;
    }
  }

  setUserSetting(name, value) {
    if (typeof this.user[name] !== 'undefined') {
      this.user[name] = value;
    }
  }

  setLayoutSetting(name, value) {
    if (typeof this.layout[name] !== 'undefined') {
      return this.layout[name] = value;
    }
  }

  toggleLayoutSetting(name) {
    return this.setLayoutSetting(name, !this.getLayoutSetting(name));
  }

}
