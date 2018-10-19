import {Component, OnInit, ViewChild} from '@angular/core';
const screenfull = require('screenfull');
const browser = require('jquery.browser');
const swal = require('sweetalert');
declare var $: any;

import {UserblockService} from '../sidebar/userblock/userblock.service';
import {SettingsService} from '../../core/settings/settings.service';
import {MenuService} from '../../core/menu/menu.service';
import {AjaxService} from '../../core/services/ajax.service';
import {Router} from '@angular/router';
import {HomeService} from "../../routes/home/home.service";
import {CookieService} from "angular2-cookie/core";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  orderRefundingNum: number = 0; //申请退款的订单数量
  navCollapsed = true; // for horizontal layout
  menuItems = []; // for horizontal layout

  isNavSearchVisible: boolean;
  @ViewChild('fsbutton') fsbutton;  // the fullscreen button

  constructor(public menu: MenuService, public userblockService: UserblockService, public settings: SettingsService, private ajax: AjaxService, private cookieService: CookieService, private router: Router, private home: HomeService) {

    // show only a few items on demo
    this.menuItems = menu.getMenu().slice(0, 4); // for horizontal layout

  }

  ngOnInit() {
    let _this = this;
    _this.isNavSearchVisible = false;
    if (browser.msie) { // Not supported under IE
      _this.fsbutton.nativeElement.style.display = 'none';
    }
    _this.orderRefundingNum = _this.home.orderRefundingNum(); //加载申请退款的订单数量
  }

  toggleUserBlock(event) {
    event.preventDefault();
    this.userblockService.toggleVisibility();
  }

  openNavSearch(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setNavSearchVisible(true);
  }

  setNavSearchVisible(stat: boolean) {
    // console.log(stat);
    this.isNavSearchVisible = stat;
  }

  getNavSearchVisible() {
    return this.isNavSearchVisible;
  }

  toggleOffsidebar() {
    this.settings.layout.offsidebarOpen = !this.settings.layout.offsidebarOpen;
  }

  toggleCollapsedSideabar() {
    this.settings.layout.isCollapsed = !this.settings.layout.isCollapsed;
  }

  isCollapsedText() {
    return this.settings.layout.isCollapsedText;
  }

  toggleFullScreen(event) {

    if (screenfull.enabled) {
      screenfull.toggle();
    }
    // Switch icon indicator
    const el = $(this.fsbutton.nativeElement);
    if (screenfull.isFullscreen) {
      el.children('em').removeClass('fa-expand').addClass('fa-compress');
    }
    else {
      el.children('em').removeClass('fa-compress').addClass('fa-expand');
    }
  }

  /**
   * 退出登录
   */
  logout() {
    this.ajax.get({
      url: '/login/logout',
      success: (result) => {
        if (result.success) {
          this.cookieService.removeAll();                 // 清空所有cookie
          this.router.navigate(['/pages/login'], {replaceUrl: true});
        }
      }
    });
  }

  /**
   * 弹出密码修改输入框
   */
  modifyPasswordInput() {
    const me = this;
    swal({
        title: '修改密码',
        text: '请输入新密码',
        type: 'input',
        inputType: 'password',
        showCancelButton: true,
        closeOnConfirm: false,
        animation: 'slide-from-top',
        inputPlaceholder: '请输入新密码'
      },
      function (inputValue) {
        if (inputValue === false) return false;
        if (inputValue === '') {
          swal.showInputError('请输入新密码');
          return false;
        }
        me.modifyPassword(inputValue);
      });
  }

  /**
   * 提交密码修改
   * @param password        要修改得密码
   */
  modifyPassword(password) {
    const me = this;
    me.ajax.put({
      url: '/assistant/modifyassistant',
      data: {assistantCode: me.settings.user.assistantCode, password: password},
      success: (result) => {
        if (result.success) {
          swal({
              title: '修改成功!',
              text: '密码修改成功，请重新登陆！',
              type: 'success',
              animation: 'slide-from-top'
            },
            function () {
              me.logout();
            });
        } else {
          swal('修改失败！', '修改失败，请检查网络后重试。', 'error');
        }
      },
      error: (res) => {
        swal('修改失败！', '修改失败，请检查网络后重试。', 'error');
      }
    });
  }

  /**
   * 进入订单取消列表页面
   */
  toRefundingOrder() {
    this.router.navigate(["/main/msgorder"], {queryParams: {state: "Refunding"}, skipLocationChange: true})
  }
}
