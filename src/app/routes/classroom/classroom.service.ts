import {Injectable} from '@angular/core';
import {AjaxService} from "../../core/services/ajax.service";
import {RzhtoolsService} from "../../core/services/rzhtools.service";
import {SettingsService} from "../../core/settings/settings.service";
import {AppComponent} from "../../app.component";

@Injectable()
export class ClassroomService {

  public searchData = {assistantCode: '', tutorCode: '', state: ''};     // 搜索信息
  public page = {curPage: 1, pageSize: 25};       // 页码信息
  public selRoom = {classroomCode: '', tutorCode: ''};       // 选中课堂信息

  constructor(private ajax: AjaxService, private tools: RzhtoolsService) {
  }

  /**
   * 获取课堂列表
   * @param {string} curPage        当前页
   * @param {string} pageSize       分页大小
   * @param searchData              查询条件
   * @returns {Array<any>}          返回课堂数组
   */
  getClassroom(curPage: number, pageSize: number, searchData: any) {
    const me = this;
    let result: Array<any> = new Array();
    let data = {curPage: curPage, pageSize: pageSize};
    Object.assign(data, searchData);
    me.ajax.get({
      url: '/classroom/list',
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
   * 老师查询留言信息
   * @param classroomCode  课堂编码
   * @param studentCode    学生编码
   * @param timeZone       时区
   */
  tutorGetMessage(classroomCode,tutorCode,timeZone){
    let me = this, result: any = {};
    me.ajax.post({
      url: '/message/assistantQueryTutorMessage',
      data: {classroomCode: classroomCode,tutorCode: tutorCode},
      async: false,
      success: res => {
        if (res.success) result = res.data || {};
        if(res.data.length>0){
          res.data.forEach(ret => {
            ret.messageInfo.forEach(item=>{
              item.createTime = me.tools.UTCToTimeZoneDate(item.createTime, timeZone);
            });
          })
        }
      },
      error: res => {
        console.log(res);
      }
    });
    return result;
  }

  /**
   * 获取课堂详情
   * @param {string} classroomCode                课堂编码
   * @param {string} tutorCode                    老师编码
   * @returns {any}                               返回课堂详情对象
   */
  getClassroomInfo(classroomCode: string, tutorCode: string) {
    const me = this;
    let result: any = {};
    me.ajax.get({
      url: 'classroom/tutor/load',
      data: {classroomCode: classroomCode, tutorCode: tutorCode},
      async: false,
      success: res => {
        if(res.success){
          result = res.data||{};
          if(res.data.classroomTraces.length>0){
            res.data.classroomTraces.sort((a,b)=>{ return new Date(a.createTime).getTime()-new Date(b.createTime).getTime();})   //升序排列
          }
        }else{
          me.tools.rzhAlt('error', '', SettingsService.I18NINFO.classroom.detailsErr);
        }
      },
      error: res => {
        console.log(res);
      }
    });
    return result;
  };

  /**
   * 取消课堂
   * @param {string} classroomCode                课堂编码
   * @param {string} tutorCode                    老师编码
   *@param {string} assistantCode                助教编码
   */
  goCancelCourse(classroomCode: string, tutorCode: string,assistantCode: string) {
    const me = this;
    let result: any = {};
    me.ajax.put({
      url: '/classroom/cancelClassroom',
      data: {classroomCode: classroomCode, tutorCode: tutorCode,assistantCode:assistantCode},
      async: false,
      success: res => {
        if(res.success){
          result = res;
          AppComponent.rzhMsg('info',SettingsService.I18NINFO.classroom.cancelSuccess)
        }else{
          me.tools.rzhAlt('error', '', SettingsService.I18NINFO.classroom.detailsErr);
        }
      },
      error: res => {
        console.log(res);
      }
    });
    return result;
  };

}
