import {Component, HostBinding, OnInit} from '@angular/core';

declare var $: any;
import {SettingsService} from './core/settings/settings.service';
import {ToasterConfig, ToasterService} from "angular2-toaster";
import {isNullOrUndefined} from "util";
import {Location} from '@angular/common';
import {NavigationEnd, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {CookieService} from "angular2-cookie/core";
import {RzhtoolsService} from "./core/services/rzhtools.service";
import {AjaxService} from "./core/services/ajax.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  //弹框提醒
  public toasterconfig: ToasterConfig =
    new ToasterConfig({
      showCloseButton: true,
      tapToDismiss: false,
      timeout: {'success': 3000, 'error': 5000,'info':5000},
      positionClass: 'toast-top-center',
      animationClass: 'slide-from-top'
    });
  static aa: ToasterService; //消息提示方法

  @HostBinding('class.layout-fixed')
  get isFixed() {
    return this.settings.layout.isFixed;
  };

  @HostBinding('class.aside-collapsed')
  get isCollapsed() {
    return this.settings.layout.isCollapsed;
  };

  @HostBinding('class.layout-boxed')
  get isBoxed() {
    return this.settings.layout.isBoxed;
  };

  @HostBinding('class.layout-fs')
  get useFullLayout() {
    return this.settings.layout.useFullLayout;
  };

  @HostBinding('class.hidden-footer')
  get hiddenFooter() {
    return this.settings.layout.hiddenFooter;
  };

  @HostBinding('class.layout-h')
  get horizontal() {
    return this.settings.layout.horizontal;
  };

  @HostBinding('class.aside-float')
  get isFloat() {
    return this.settings.layout.isFloat;
  };

  @HostBinding('class.offsidebar-open')
  get offsidebarOpen() {
    return this.settings.layout.offsidebarOpen;
  };

  @HostBinding('class.aside-toggled')
  get asideToggled() {
    return this.settings.layout.asideToggled;
  };

  @HostBinding('class.aside-collapsed-text')
  get isCollapsedText() {
    return this.settings.layout.isCollapsedText;
  };

  constructor(public tools:RzhtoolsService,public settings: SettingsService, public toaster: ToasterService, private cookieService: CookieService, private location: Location, private router: Router, public translate: TranslateService) {
    AppComponent.aa = toaster; //消息提示
    translate.addLangs(["en", "zh"]);
    let browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|zh/) ? browserLang : 'en');
    tools.getI18nInfos(); //获取国际化信息
  }

  ngOnInit() {
    let _this = this;
    //监听路由变化,登录拦截
    _this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event) => {
      _this.checkLogin();
    });
  }

  /**
   * 消息提醒
   * @param type 类型：success、info、error...
   * @param title 信息头
   * @param info 信息内容
   */
  static rzhMsg(type: string, title: string, info?: string) {
    if (isNullOrUndefined(info)) AppComponent.aa.pop(type, title);
    else AppComponent.aa.pop(type, title, info);
  }

  private checkLogin() {
    const url = this.location.path();
    const loginCookie = this.cookieService.getObject('loginInfo'),                    // 获取用户信息
      sessionId = this.cookieService.get('AssistantSessionId');                   // 获取登陆状态
    if ((url !== '/pages/login' && !loginCookie) || !sessionId) this.router.navigate(['/pages/login'], {replaceUrl: true}); // 路由跳转
    if (url == '/pages/login' && sessionId && loginCookie) {
      this.router.navigate(['/main/home'], {replaceUrl: true}); // 路由跳转
    }
    if (loginCookie) Object.assign(this.settings.user, loginCookie);
  }

}
