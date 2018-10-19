import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TranslatorService} from '../core/translator/translator.service';
import {MenuService} from '../core/menu/menu.service';
import {SharedModule} from '../shared/shared.module';
import {routes} from './routes';
import {PagesModule} from "./pages/pages.module";
import {SettingsService} from "../core/settings/settings.service";
import {Menu} from "./menu";
import {CookieService} from "angular2-cookie/core";

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forRoot(routes, {useHash: true}),
    PagesModule
  ],
  declarations: [],
  exports: [
    RouterModule
  ]
})

export class RoutesModule {
  constructor(public menuService: MenuService, tr: TranslatorService, public setting: SettingsService,private cookieService: CookieService) {
    setTimeout(() => {
      let menu = new Menu(), menuList = menu.menuList,me=this;
      const loginCookie = me.cookieService.getObject('loginInfo');                   // 获取用户信息
      if (loginCookie) Object.assign(me.setting.user, loginCookie);             //重新赋值  因为在这个文件和app.module 无法确定先后，不能笼统的设置多少毫秒，因为不知道app.module 加载多块
      if (setting.user.manageState == "Super") {  //如果是超级管理员，则拥有 系统管理、消息通知管理，导出中心 这三块
        menuList.push(menu.system);
        menuList.push(menu.msgTemplate);
        menuList.push(menu.exportCenter);
      }
      menuService.addMenu(menuList);
    }, 0);
  }
}
