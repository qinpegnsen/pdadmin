import { Component, OnInit, ViewChild } from '@angular/core';
import {StudentService} from "../student.service";
import {Page} from "../../../core/page/page";
import {PageEvent} from "../../../shared/directives/ng2-datatable/DataTable";
import { Router} from "@angular/router";
import {PatternService} from "../../../core/forms/pattern.service";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {SettingsService} from "../../../core/settings/settings.service";
const swal = require('sweetalert');

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {
  private students: Page = new Page();     // 学生数据Page对象
  private recharge: boolean = false;
  private selStudentCode: string;

  @ViewChild('searchForm') searchForm;       // 表单对象

  constructor(public student: StudentService, public router: Router, public patterns: PatternService, public tools: RzhtoolsService) { }

  ngOnInit() {
    this.getData(this.student.searchData);
  }

  /**
   * 获取数据
   * @param event     翻页事件
   */
  getData(data?: any, event?: PageEvent) {
    const me = this;
    let activePage = event ? event.activePage : 1;
    if (typeof event !== 'undefined') {
      activePage = event.activePage;
      sessionStorage.setItem('studentCurPage',String(event.activePage));
    }
    const pageSize = me.students.pageSize || 25;
    if(data){
      this.student.searchData = data;
    }else {
      this.student.searchData = {email: '', name: ''};
      this.searchForm.reset();
    };
    const result = me.student.getStudentList( Number(sessionStorage.getItem('studentCurPage'))||activePage, pageSize, this.student.searchData);
    me.students = new Page(result);
  };

  /**
   * 跳转到详情页
   * @param code    学生编码
   */
  goDetail(code) {
    this.router.navigate(['/main/user/detail'], {queryParams:{code: code}});
  }

  payFor(code) {
    let me = this;
    me.recharge = true;
    me.selStudentCode = code;
  }

  /**
   * 打开/关闭充值窗口
   */
  rechargeOnOff() {
    this.recharge = !this.recharge;
  }

  /**
   * 为企业充值
   * @param data
   */
  onrecharge(data) {
    let me = this;
    if(data.valid) {
      let startTimeUTC = me.tools.dateToUTC();
      let endTime = me.tools.dataFormat(me.tools.getAroundDateByDate(new Date(), data.value.endTime), 'yyyy-MM-dd HH:mm:ss');
      let endTimeUTC = me.tools.dateToUTC(endTime);
      let rechargeData = {
        courseHour: data.value.courseHour,
        startTime: startTimeUTC,
        endTime: endTimeUTC,
      };
      me.student.recharge(me.selStudentCode, rechargeData, res => {
        me.tools.rzhAlt('success', SettingsService.I18NINFO.enterprise.rechargeSuccess);
        me.recharge = false;
      })
    }
  }

}
