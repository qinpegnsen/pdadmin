import {Injectable} from '@angular/core';
import {AjaxService} from "../../core/services/ajax.service";
import {RzhtoolsService} from "../../core/services/rzhtools.service";
import {SettingsService} from "../../core/settings/settings.service";

@Injectable()
export class EnterpriseService {

  constructor(private ajax: AjaxService, private tools: RzhtoolsService) {
  }

  /**
   * 获取企业列表
   * @param {string} curPage             当前页
   * @param {string} pageSize            分页大小
   * @returns {{}}                     返回企业列表数据
   */
  getEnterprises(curPage: number, pageSize: number) {
    let me = this, result = {};
    me.ajax.get({
      url: '/student/enterprise/list',
      data: {curPage: curPage, pageSize: pageSize},
      async: false,
      success: res => {
        res.success ? result = res.data || {} : me.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e114);
      },
      error: res => {
        console.log(res);
      }
    });
    return result;
  };

  /**
   * 获取企业绑定的学生
   * @param {string} studentCode            学生编码
   */
  getMember(studentCode: string) {
    let me = this, result = new Array();
    me.ajax.get({
      url: '/student/enterprise/share/load',
      data: {studentCode: studentCode},
      async: false,
      success: res => {
        res.success ? result = (res.data ? res.data.courseHourShareStudents : []) : me.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e114);
      },
      error: res => {
        console.log(res);
      }
    });
    return result;
  };

  /**
   * 添加企业
   * @param data           企业信息数据
   * @param callback        成功回调
   */
  addEnetrprise(data: any, callback?: any) {
    let me = this;
    me.ajax.post({
      url: '/student/enterprise/signup',
      data: data,
      success: res => {
        console.log(res);
        res.success ? callback && callback(res) : me.tools.rzhAlt('error', SettingsService.I18NINFO.enterprise.addErr);
      },
      error: res => {
        console.log(res);
      }
    });
  };

  /**
   * 为企业添加成员
   * @param data                添加成员信息
   * @param callback             成功回调
   */
  addMember(data: any, callback?: any) {
    let me = this;
    let signData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      timeZone: data.timeZone,
      countryCode: data.countryCode
    };
    me.ajax.post({
      url: '/student/staff/signup',
      data: signData,
      success: res => {
        if (res.success) {
          let shareData = {
            sharedStudentCode: data.sharedStudentCode,
            sharedStudentName: data.sharedStudentName,
            sharedStudentEmail: data.sharedStudentEmail,
            acceptStudentCode: res.data.studentCode,
            acceptStudentName: res.data.name,
            acceptStudentEmail: res.data.email,
            upperLimit: data.upperLimit
          };
          me.ajax.post({
            url: '/student/share',
            data: shareData,
            success: res => {
              res.success ? callback && callback(res) : me.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e144);
            },
            error: res => {
              console.log(res);
            }
          });
        } else {
          me.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e102);
        }
      },
      error: res => {
        console.log(res);
      }
    });
  };

  /**
   * 格式化学生注册数据
   * @param data              学生注册数据
   * @returns {{firstName: (any | string); lastName: (any | string); email: (any | string); password; age: (any | string); sex: (any | string); countryCode: (any | Array<any> | string); timeZone: (any | string | Array); introduction: any}}         返回格式化的数据
   * @constructor
   */
  FormatEnterprise(data) {
    let result = {
      studentCode: data.studentCode,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      age: data.age,
      sex: data.sex,
      countryCode: data.countryCode,
      timeZone: data.timeZone,
      introduction: data.introductiodata
    };
    return result;
  };

  /**
   * 格式化成员信息
   * @param data             要格式化的数据
   * @returns {{studentCode: (string | any); firstName: (any | string); lastName: (any | string); timeZone: (any | Array | string); age: (any | string); sex: (any | string); countryCode: (any | Array<any> | string); upperLimit: number}}   格式化后的数据
   * @constructor
   */
  FormatMember(data) {
    let result = {
      studentCode: data.student.studentCode,
      firstName: data.student.firstName,
      lastName: data.student.lastName,
      timeZone: data.student.timeZone,
      age: data.student.age,
      sex: data.student.sex,
      countryCode: data.student.countryCode,
      upperLimit: data.upperLimit
    };
    return result;
  };

  /**
   * 修改学生信息
   * @param {string} studentCode           学生编码
   */
  modifyStudent(studentCode: string, data: any, callback?: any, isStudent: Boolean = true,) {
    let me = this;
    data.studentCode = studentCode;
    me.ajax.put({
      url: '/student/modify',
      data: data,
      success: res => {
        if (isStudent) {
          res.success ? this.modifyShare(data.studentCode, data.upperLimit, callback) : this.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e125);
        } else {
          res.success ? callback && callback(res) : this.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e125);
        }
      },
      error: res => {
        console.log(res);
      }
    });
  };

  /**
   * 修改学生分享课时上限
   * @param {string} acceptStudentCode                被分享学生编码
   * @param {number} upperLimit                   分享上限
   * @param callback               成功回调
   */
  modifyShare(acceptStudentCode: string, upperLimit: number, callback?: any) {
    let me = this;
    me.ajax.put({
      url: '/student/modify/share',
      data: {acceptStudentCode: acceptStudentCode, upperLimit: upperLimit},
      success: res => {
        res.success ? callback && callback(res) : this.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e125);
      },
      error: res => {
        console.log(res);
      }
    });
  };

  /**
   * 删除企业绑定学生
   * @param {string} sharedStudentCode            企业编码
   * @param {string} acceptStudentCode            成员编码
   * @param callback                    成功回调
   */
  deleteShare(sharedStudentCode: string, acceptStudentCode: string, callback?: any) {
    let me = this;
    me.ajax.put({
      url: '/student/share/delete',
      data: {sharedStudentCode: sharedStudentCode, acceptStudentCode: acceptStudentCode},
      success: res => {
        res.success ? callback && callback(res) : this.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e131);
      },
      error: res => {
        console.log(res);
      }
    });
  };

  /**
   * 为企业充值课时
   * @param studentCode          企业编码
   * @param rechargeData         充值的数据
   * @param callback           成功回调
   */
  recharge(studentCode: string, rechargeData: any, callback?: any) {
    let me = this;
    rechargeData.studentCode = studentCode;
    me.ajax.post({
      url: '/order/enterprise/recharge',
      data: rechargeData,
      success: res => {
        res.success ? callback && callback(res) : this.tools.rzhAlt('error', SettingsService.I18NINFO.enterprise.rechargeErr);
      },
      error: res => {
        console.log(res);
      }
    })
  }
}
