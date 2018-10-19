import { Injectable } from '@angular/core';
import {AjaxService} from "../../core/services/ajax.service";
import {RzhtoolsService} from "../../core/services/rzhtools.service";
import {SettingsService} from "../../core/settings/settings.service";

@Injectable()
export class StudentService {
  public searchData: any = {email: '', name: ''};    // 搜索数据

  constructor(public ajax: AjaxService, public tools: RzhtoolsService) { }

  /**
   * 获取学生列表
   * @param curPage     当前页
   * @param pageSize    分页大小
   * @returns {{}}      返回学生列表对象
   */
  getStudentList(curPage: number, pageSize: number, searchData: any) {
    let me = this;
    let result = {};
    let data = Object.assign({curPage: curPage, pageSize: pageSize}, searchData);
    me.ajax.get({
      url: '/student/list',
      data: data,
      async: false,
      success: res => {
        if(res.success) {
          result = res.data || {};
        }else {
          me.tools.rzhAlt('error', SettingsService.I18NINFO.student.getStudentList);
        };
      },
      error: res => {
        console.log(res);
      }
    });
    return result;
  };

  /**
   * 获取学生详情
   * @param studentCode    学生编码
   * @returns {{}}     返回学生信息对象
   */
  getStudentDetail(studentCode: string){
    let me = this;
    let result = {};
    me.ajax.get({
      url: '/student/load/detail',
      data: {studentCode: studentCode},
      async: false,
      success: res => {
        if(res.success) {
          result = res.data || {};
        }else {
          me.tools.rzhAlt('error', SettingsService.I18NINFO.student.getDetailErr);
        };
      },
      error: res => {
        console.log(res);
      }
    });
    return result;
  }

  recharge(studentCode: string, data: any, callback?: any){
    let me = this;
    data.studentCode = studentCode;
    me.ajax.post({
      url: '/student/coursehour/recharge',
      data: data,
      success: res => {
        if(res.success){
          callback && callback(res)
        }else {
          me.tools.rzhAlt('error', SettingsService.I18NINFO.enterprise.rechargeErr);
        }
      },
      error: res => {
        console.log(res);
      }
    })
  }

}
