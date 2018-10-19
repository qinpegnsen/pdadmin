import {SettingsService} from "../core/settings/settings.service";
import {Injectable} from "@angular/core";

@Injectable()
export class Menu {
  menuList: Array<any> = new Array();

  constructor() {
    let _this = this;
    _this.menuList = [
      _this.headingMain,
      _this.Home,
      _this.Course,
      _this.Assistant,
      _this.User,
      _this.timetableAdd,
      _this.goods,
      _this.msgorder,
      _this.Zoom,
      _this.Classroom,
      _this.Enterprise,
      _this.questionnaire
    ]; //没有系统设置和消息模板和导出课时信息
  }

  Home = {
    text: SettingsService.I18NINFO.menu.home,
    link: '/main/home',
    icon: 'icon-home'
  };

  Course = {                     // 课程制定
    text: SettingsService.I18NINFO.menu.course,
    link: '/main/cour',
    icon: 'icon-book-open',
    submenu: [
      {
        text: '课程制定',
        link: '/main/cour/course'       // 老师管理
      },
      {
        text: '课件管理',
        link: '/main/cour/ware'       // 助教管理
      }
    ]
  };

  timetableAdd = {               // 制定课表
    text: SettingsService.I18NINFO.menu.timetableAdd,
    link: '/main/tTableAdd',
    icon: 'icon-note'
  };

  goods = {                      // 课时商品
    text: SettingsService.I18NINFO.menu.goods,
    link: '/main/classGoods',
    icon: 'icon-present'
  };

  msgorder = {                      // 订单信息
    text: SettingsService.I18NINFO.menu.msgorder,
    link: '/main/msgorder',
    icon: 'icon-docs'
  };

  system = {                      // 系统设置
    text: SettingsService.I18NINFO.menu.system,
    link: '/main/system',
    icon: 'icon-settings'
  };

  Assistant = {                  // 教师及助教
    text: SettingsService.I18NINFO.menu.assistant,
    link: '/main/assis',
    icon: 'fa fa-users',
    submenu: [
      {
        text: SettingsService.I18NINFO.menu.teacher,
        link: '/main/assis/teach'       // 老师管理
      },
      {
        text: SettingsService.I18NINFO.menu.ass,
        link: '/main/assis/assis'       // 助教管理
      }
    ]
  };

  Enterprise = {                      // 企业管理
    text: SettingsService.I18NINFO.menu.enterprise,
    link: '/main/enterprise',
    icon: 'fa fa-sitemap'
  };

  Classroom = {                      // 课堂信息
    text: SettingsService.I18NINFO.menu.classroom,
    link: '/main/room',
    icon: 'fa fa-book'
  };

  User = {                      // 学生信息
    text: SettingsService.I18NINFO.menu.student,
    link: '/main/user',
    icon: 'fa fa-mortar-board '
  };

  Zoom = {                      // zoom管理
    text: SettingsService.I18NINFO.menu.zoom,
    link: '/main/zoom',
    icon: 'fa fa-tasks'
  };

  msgTemplate = {                      // 消息模板
    text: SettingsService.I18NINFO.menu.msgTemplate,
    link: '/main/msgTemplate',
    icon: 'fa fa-edit'
  };

  headingMain = {
    // text: 'Main Navigation',
    text: SettingsService.I18NINFO.menu.headingMain,
    heading: true
  };

  exportCenter = {                         //导出中心
    text: SettingsService.I18NINFO.menu.exportCenter,
    link: '/main/export',
    icon: 'fa fa-file-excel-o',
    submenu: [
      {
        text: '老师信息',
        link: '/main/export/tutor'       // 老师模板信息
      },
      {
        text: '学生信息',
        link: '/main/export/stu'        // 学生模板信息
      },
      {
        text: '薪资计算',
        link: '/main/export/calculate'        // 学生模板信息
      }
    ]
  };

  questionnaire = {                      // 问卷调查
    text: SettingsService.I18NINFO.menu.questionnaire,
    link: '/main/questionnaire',
    icon: 'fa fa-list-alt'
  };
}



