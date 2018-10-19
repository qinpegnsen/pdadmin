import { Injectable } from '@angular/core';
import {SettingsService} from "../../core/settings/settings.service";
import {RzhtoolsService} from "../../core/services/rzhtools.service";
import {AjaxService} from "../../core/services/ajax.service";

@Injectable()
export class QuestionnaireService {

  constructor(private ajax: AjaxService, private tools: RzhtoolsService) { }

  /**
   * 获取调查问卷列表
   * @param {string} curPage        当前页
   * @param {string} pageSize       分页大小
   * @param searchData              查询条件
   * @returns {Array<any>}          返回课堂数组
   */
  getQuestionnaireRecordList(curPage: number, pageSize: number, searchData: any) {
    const me = this;
    let result: Array<any> = new Array();
    let data = {curPage: curPage, pageSize: pageSize};
    Object.assign(data, searchData);
    me.ajax.get({
      url: '/classroom/questionnaireRecordList',
      data: data,
      async: false,
      success: res => {
        res.success ? result = res.data : me.tools.rzhAlt('error', '', SettingsService.I18NINFO.classroom.queryErr);
      },
      error: res => {
        console.log(res);
      }
    });
    return result;
  };


  /**
   * 获取调查问卷记录
   * @param classroomCode              课堂编码
   */
  loadStudentQuestionnaireRecord(classroomCode: any) {
    const me = this;
    let result: any;
    let data = {classroomCode: classroomCode};
    me.ajax.get({
      url: '/classroom/loadStudentQuestionnaireRecord',
      data: data,
      async: false,
      success: res => {
        res.success ? result = res.data : me.tools.rzhAlt('error', '', SettingsService.I18NINFO.classroom.queryErr);
      },
      error: res => {
        console.log(res);
      }
    });
    return result;
  };


  /**
   * 查询课程列表
   *
   * @param {string} curPage      // 当前页
   * @param {string} pageSize     // 分页大小
   * @returns {any}               //返回课程对象
   */
  getCourseList(requestParmas: any) {
    let result = {voList: []};
    const me = this;
    me.ajax.get({
      url: '/course/list',
      data: requestParmas,
      async: false,
      success: res => {
        res.success ? result = res.data || {tutorCourses: []} : me.tools.rzhAlt('error', '', SettingsService.I18NINFO.swat.e134);
      },
      error: res => {
        console.log(res);
      }
    });
    return result;
  };


  /**
   * load 单个课堂的老师信息
   *
   * @returns {any}               //返回课程对象
   */
  loadClassrome(classroomCode: string,tutorCode	:string) {
    let result :any;
    const me = this;
    let data={
      classroomCode:classroomCode,
      tutorCode:tutorCode
    };
    me.ajax.get({
      url: '/classroom/tutor/load',
      data: data,
      async: false,
      success: res => {
        res.success ? result = res.data || {tutorCourses: []} : me.tools.rzhAlt('error', '', SettingsService.I18NINFO.swat.e134);
      },
      error: res => {
        console.log(res);
      }
    });
    return result;
  };

}
