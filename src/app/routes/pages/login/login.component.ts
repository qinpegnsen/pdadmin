import {Component, OnInit} from '@angular/core';
import {SettingsService} from '../../../core/settings/settings.service';
import {PatternService} from '../../../core/forms/pattern.service';
import {AjaxService} from '../../../core/services/ajax.service';
import {CookieService} from 'angular2-cookie/core';
import {Router} from '@angular/router';
import {MaskService} from '../../../core/services/mask.service';
import {RzhtoolsService} from '../../../core/services/rzhtools.service';
import {Menu} from "../../menu";
import {MenuService} from "../../../core/menu/menu.service";
declare var $:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(public menuService: MenuService, public settings: SettingsService, private maskservice: MaskService, private patterns: PatternService, private _cookieService: CookieService, private ajax: AjaxService, private router: Router, private tools: RzhtoolsService) {
  }

  ngOnInit() {
  }

  // 用户登录
  public login(event, form) {
    let start = new Date().getTime(), end;
    const me = this;
    const Reg = new RegExp(me.patterns.phone);
    this.maskservice.showMask();
    let data = {};
    if (Reg.test(form.value.userName)) data = {phone: $.trim(form.value.userName), password: $.trim(form.value.password)}; // 判断用户输入是手机还是邮箱
    else data = {email: $.trim(form.value.userName), password: $.trim(form.value.password)};
    me.ajax.post({
      url: '/login/assitant/signin',
      data: data,
      async: false,
      success: result => {
        me.maskservice.hideMask(); // 关闭wait遮罩
        end = new Date().getTime();
        if (result.success) {
          let user = result.data;
          me._cookieService.putObject('loginInfo', user); // 用户信息存入cookie
          Object.assign(me.settings.user, user); // 用户信息存入公共服务
          /**************************************设置menu导航 begin****************************************************/
          let menu = new Menu(), menuList = menu.menuList;
          me.menuService.menuItems = new Array();
          if (me.settings.user.manageState == "Super") {  //如果是超级管理员，则拥有 系统管理、消息通知管理，导出课时信息 这两块
            menuList.push(menu.system);
            menuList.push(menu.msgTemplate);
            menuList.push(menu.exportCenter);
          }
          me.menuService.addMenu(menuList);
          /**************************************设置menu导航 end******************************************************/
          me.router.navigate(['/main/home'], {replaceUrl: true}); // 路由跳转
        }
        else {
          me.tools.rzhAlt('error',SettingsService.I18NINFO.swat.e112, SettingsService.I18NINFO.swat.e120);
        }
      },
      error: result => {
        me.maskservice.hideMask();
        me.tools.rzhAlt('error',SettingsService.I18NINFO.swat.e112, SettingsService.I18NINFO.swat.e114);
      }
    });
  }

}
