import {Injectable} from '@angular/core';
import {AjaxService} from '../../core/services/ajax.service';
import {RzhtoolsService} from '../../core/services/rzhtools.service';
import {CourseService} from "../course/course.service";
import {SettingsService} from "../../core/settings/settings.service";
import {isNullOrUndefined} from "util";

@Injectable()
export class AssistantService {
  constructor(private ajax: AjaxService, private tools: RzhtoolsService, private course: CourseService) {}

  /**
   * 获取助教列表
   * @param {string} curPage        *当前页
   * @param {string} pageSize       *分页大小
   * @param {string} manageState    管理状态
   * @returns {any}
   */
  getAssistant(curPage: string, pageSize: string, manageState: string = '') {
    let result: any = {};
    const me = this;
    me.ajax.get({
      url: '/assistant/assistants',
      data: {
        curPage: curPage,
        pageSize: pageSize,
        manageState: manageState
      },
      async: false,
      success: res => {
        res.success? result = res.data || {}:  me.tools.rzhAlt('error', '', SettingsService.I18NINFO.assistant.loadErr);
      },
      error: res => {
        console.log(res);
      }
    });
    return result;
  };

  /**
   * 添加助教
   * @param assistantData       *添加助教数据
   * @param callback            执行成功回调
   */
  addAssistant(assistantData: any, callback: any, file?: string) {
    const me = this;
    me.ajax.post({
      url: '/assistant/add',
      data: assistantData,
      success: res => {
        if(res.success) {
          if(file){
            me.upload(res.data.assistantCode, file, callback);
          }else {
            callback(res);
          }
        } else{
          me.tools.rzhAlt('error', '', SettingsService.I18NINFO.assistant.addErr);
        }
      },
      error: res => {
        me.tools.rzhAlt('error', '', SettingsService.I18NINFO.assistant.addErr);
      }
    });
  };

  /**
   * 上传图片
   * @param studentCode        学生编码
   * @param file              图片base64
   * @param callback         成功回调
   */
  upload(assistantCode: string, file: string, callback: any) {
    let me = this,
      uid = me.tools.uploadUid();
    file = file.split('base64,')[1];
    me.ajax.post({
      url: '/upload/assistant/avatar',
      data: {file: file, uid: uid},
      success: res => {
        if(res.success) {
          me.updataPic(assistantCode, uid, callback);
        }else {
          me.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e136);
          // swat(SettingsService.I18NINFO.swat.e225,SettingsService.I18NINFO.swat.e227, 'error');
        };
      },
      error: res => {
        console.log(res);
      }
    });
  }

  /**
   * 更新学生头像
   * @param studentCode       学生编码
   * @param uid               上传图片唯一标识
   * @param callback          成功回调
   */
  updataPic(assistantCode: string, uid: string, callback: any) {
    let me = this;
    me.ajax.put({
      url: '/assistant/avatar',
      data: {assistantCode: assistantCode, uid: uid},
      success: res => {
        if (res.success){
          callback(res);
        }else {
          me.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e136);
        };
      },
      error: res => {
        console.log(res);
      }
    });
  }

  /**
   * 给助教添加老师
   * @param {string} assistantCode          *助教编码
   * @param {string} tutorCode              *老师编码
   */
  addAtutors(assistantCode: string, tutorCode: string, callback?: any) {
    const me = this;
    me.ajax.post({
      url: '/assistant/addatutors',
      data: {assistantCode: assistantCode, tutorCode: tutorCode},
      success: res => {
        res.success? callback && callback(res): me.tools.rzhAlt('error', '', SettingsService.I18NINFO.assistant.bindErr);
      },
      error: res => {
        console.log(res);
      }
    });
  };

  /**
   * 获取助教详情
   * @param {string} assistantCode       *助教编码
   */
  getAssistantDetail(assistantCode: string) {
    let result: any = {};
    let me = this;
    me.ajax.get({
      url: '/assistant/loadassistantDetail',
      async: false,
      data: {assistantCode: assistantCode},
      success: res => {
        res.success? result = res.data || {}: me.tools.rzhAlt('error', '', SettingsService.I18NINFO.assistant.detailsErr);
      },
      error: res => {
        console.log(res);
      }
    });
    return result;
  };

  /**
   * 修改助教信息
   * @param assistantData      // 助教数据
   * @param callback           // 成功回调
   */
  modifyAssistant(assistantData: any, callback?: any) {
    const me = this;
    if(!/^[a-zA-Z0-9_]{6,16}$/.test(assistantData.password)) {
      delete assistantData.password;
    };
    me.ajax.put({
      url: '/assistant/modifyassistant',
      data: assistantData,
      success: res => {
        res.success? callback && callback(res): me.tools.rzhAlt('error', '', SettingsService.I18NINFO.assistant.updateErr);
      },
      error: res => {
        console.log(res);
      }
    });
  };

  /**
   * 解除助教老师绑定
   * @param {string} assistantCode          助教编码
   * @param {string} tutorCode              老师编码
   * @param callback                        成功回调
   */
  modifyAssistantTutor(assistantCode: string, tutorCode: string, callback?: any) {
    const me = this;
    me.ajax.put({
      url: '/assistant/modifyAssistantTutor',
      data: {assistantCode: assistantCode, tutorCode: tutorCode},
      success: res => {
        res.success? callback && callback(res): me.tools.rzhAlt('error', '', SettingsService.I18NINFO.assistant.unBindErr);
      },
      error: res => {
        console.log(res);
      }
    });
  };

  /**
   * 获取可用老师列表
   * @returns {Array<any>}    //返回老师数组
   */
  getTutorsAll() {
    let result: Array<any> = new Array();
    const me = this;
    me.ajax.get({
      url: '/tutor/activatetutors',
      async: false,
      success: res => {
        res.success? result = res.data || []: me.tools.rzhAlt('error', '', SettingsService.I18NINFO.assistant.queryErr);
      },
      error: res => {
        console.log(res);
      }
    });
    return result;
  };

  /**
   * 查询课程分类列表
   */
  coursesTypeList(){
    let _this = this, ret: Array<any> = new Array();
    _this.ajax.get({
      url: '/course/category/list',
      data:{curPage:1,pageSize:999,state:"Activate"},
      async: false,
      success: (response) => {
        if (response.success) ret = response.data.voList;
      }
    })
    if(ret.length>0) ret = _this.tools.arrayToTree(ret,"categoryCode");
    return ret;
  }


  /**
   * 查询课程列表
   * @param categoryCode
   * @returns {Array<any>}
   */
  coursesList(categoryCode?:string) {
    let _this = this, ret: Array<any> = new Array();
    _this.ajax.get({
      url: '/course/list',
      data:{curPage:1,pageSize:999,categoryCode:categoryCode},
      async: false,
      success: (response) => {
        if (response.success) ret = response.data.voList;
      }
    })
    return ret;
  }

  /**
   * 转换老师列表格式tag-input使用
   * @returns {any[]}      //返回数组
   */
  getTutorList() {
    const tutors = this.getNoBindTutor();
    const tutorList = new Array();
    tutors.forEach(el => {
      tutorList.push({
        value: el.tutorCode,
        display: el.name
      });
    });
    return tutorList;
  };

  /**
   * 添加老师
   * @param tutorData      老师信息
   * @param callback       成功回调
   */
  addTutor(tutorData: any, callback?: any) {
    const me = this;
    tutorData.isAssess = tutorData.isAssess ? 'Y' : 'N',
    tutorData.isConsult = tutorData.isConsult ? 'Y' : 'N',
    me.ajax.post({
      url: '/tutor/add',
      data: tutorData,
      success: res => {
        if(res.success){
          callback && callback(res)
        }else{
          if(res.data.code==9005){
            me.tools.rzhAlt('error', SettingsService.I18NINFO.assistant.resultExit);
          }
        }
      },
      error: res => {
        console.log(res);
      }
    });
  };

  /**
   * 获取老师详细信息
   * @param {string} tutorCode             被获取老师的编码
   * @param {string} email                 被获取老师的邮箱
   * @param {string} phone                 被获取老师的手机
   * @returns {any}                        返回获取的数据
   */
  getTutorMore(tutorCode: string, email?: string, phone?: string) {
    const me = this;
    let result;
    me.ajax.get({
      url: '/tutor/loadall',
      data: {tutorCode: tutorCode, email: email || '', phone: phone || ''},
      async: false,
      success: res => {
        res.success? result = res.data || {}: me.tools.rzhAlt('error', '', SettingsService.I18NINFO.assistant.detailsTeacherErr);
      },
      error: res => {
        console.log(res);
      }
    });
    result.isAssess = result.isAssess == 'Y' ? true : false;
    result.isConsult = result.isConsult == 'Y' ? true : false;
    return result;
  };

  /**
   * 给老师绑定课程
   * @param {string} tutorCode            老师编码
   * @param {string} courseCode           课程编码
   * @param callback
   */
  addTutorCourse(tutorCode: string, courseCode: string, callback?: any){
    const me = this;
    me.ajax.post({
      url: '/tutor/course/add',
      data: {tutorCode: tutorCode, courseCode: courseCode},
      success: res => {
        res.success? callback && callback(res): me.tools.rzhAlt('error', '', SettingsService.I18NINFO.assistant.bindErr);
      },
      error: res => {
        console.log(res);
      }
    });
  };

  /**
   * 为教师删除绑定课程
   * @param tutorCode       教师编码
   * @param courseCode      课程编码
   * @param callback      成功回调
   */
  deleteCourse(tutorCode: string, courseCode: string, callback?: any) {
    let me = this;
    me.ajax.del({
      url: '/tutor/course/delete',
      data: {tutorCode: tutorCode, courseCode: courseCode},
      success: res => {
        res.success ? callback && callback(res) : me.tools.rzhAlt('error', '', SettingsService.I18NINFO.assistant.delBindErr);
      },
      error: res => {
        console.log(res);
      }
    });
  }


  /**
   * 获取tag-input使用课程列表
   * @returns {Array<any>}   返回格式化的数组
   */
  getCourseList(arr: Array<any>) {
    let result: Array<any> = new Array();
    arr.forEach(el => {
      result.push({
        value: el.courseCode,
        display: el.course
      });
    });
    return result;
  };

  /**
   * 修改老师密码
   * @param {string} email              被修改的老师邮箱
   * @param {string} phone              被修改的老师手机
   * @param {string} oldpwd             被修改的旧密码
   * @param {string} newpwd             被修改的新密码
   * @param callback
   */
  modifyPwd (phone: string, oldpwd: string, newpwd: string, callback?: any) {
    const me = this;
    me.ajax.put({
      url: '/tutor/modifypwd',
      data: {phone: phone, oldpwd: oldpwd , newpwd: newpwd },
      success: res => {
        res.success? callback && callback(res): me.tools.rzhAlt('error', '', SettingsService.I18NINFO.assistant.updatePwdErr);
      },
      error: res => {
        console.log(res);
      }
    });
  };

  /**
   * 修改老师状态
   * @param {string} email                被修改的老师邮箱
   * @param {string} phone                被修改的老师手机
   * @param {string} state                要修改的状态
   * @param callback                      成功回调
   */
  modifyState (teacherCode: string, email: string, state: string, callback?: any) {
    const me = this;
    me.ajax.put({
      url: '/tutor/modifystate',
      data: {email: email, teacherCode: teacherCode, state: state},
      success: res => {
        res.success? callback && callback(res): me.tools.rzhAlt('error', '', SettingsService.I18NINFO.assistant.updateStateErr)
      },
      error: res => {
        console.log(res);
      }
    });
  };

  /**
   * 修改教师信息
   * @param teacherCode       教师编码
   * @param isAssess          是否可评价
   * @param isConsult         是否可咨询
   * @param callback           成功回调
   */
  modifyTutor(tutorCode: string, isAssess: boolean, isConsult: boolean,  callback?: any){
    const me = this;
    me.ajax.put({
      url: '/tutor/modify',
      data: {tutorCode: tutorCode, isAssess: isAssess ? 'Y' : 'N', isConsult: isConsult ? 'Y' : 'N'},
      success: res => {
        res.success? callback && callback(res): me.tools.rzhAlt('error', '', '修改教师信息失败');
      },
      error: res => {
        console.log(res);
      }
    });
  };

  /**
   * 查询老师
   * @param {string} curPage          当前页
   * @param {string} pageSize         分页大小
   * @param searchData                搜索条件
   * @returns {any}                   返回查询到的老师
   */
  searchTutors (curPage: string, pageSize: string, searchData?: any) {
    const me = this;
    const initData = Object.assign({curPage: curPage, pageSize: pageSize}, searchData);
    let result = {voList: []};
    me.ajax.get({
      url: '/tutor/tutors',
      data: initData,
      async: false,
      success: res => {
        res.success? result = res.data || {}: me.tools.rzhAlt('error', '', SettingsService.I18NINFO.assistant.loadTeacherErr);
      },
      error: res => {
        console.log(res);
      }
    });
    return result;
  };

  /**
   * 删除老师
   * @param {string} tutorCode              老师编码
   * @param {string} email                  老师邮箱
   * @param callback                        成功回调
   */
  deleteTutor(tutorCode: string, email: string, callback?: any) {
    const me = this;
    me.ajax.put({
      url: '/tutor/delete',
      data: {email: email, tutorCode: tutorCode},
      success: res => {
        res.success? callback && callback(): me.tools.rzhAlt('error', '', SettingsService.I18NINFO.swat.e102);
      },
      error: res => {
        console.log(res);
      }
    });
  };

  /**
   * 获取国家代码
   */
  getCountries(){
    const me = this;
    let result: Array<any> = new Array();
    me.ajax.get({
      url: '/res/area/countries',
      async: false,
      success: res => {
        res.success? result = res.data: me.tools.rzhAlt('error', '',SettingsService.I18NINFO.assistant.countryCodeErr);
      },
      error: res => {
        console.log(res);
      }
    });
    return result;
  };

  /**
   * 添加工作时间
   * @param {string} tutorCode         教师编码
   * @param {string} startTime         开始时间
   * @param {string} endTime           结束时间
   * @param callback           成功回调
   */
  addWordTime(data: Array<Week>, callback?: any) {
    let me = this;
    me.ajax.post({
      url: '/tutor/worktime',
      contentType: "application/json;charset=utf-8",
      data: JSON.stringify(data),
      success: res => {
        res.success? callback && callback(res): me.tools.rzhAlt('error', '', SettingsService.I18NINFO.assistant.workTimeErr);
      },
      error: res => {
        console.log(res);
      }
    });
  };

  /**
   * 删除教师工作时间
   * @param workTimeCode     工作时间编码
   * @param callback       成功回调
   */
  delWorkTime(workTimeCode: string, callback?: any) {
    let me = this;
    me.ajax.put({
      url: "/tutor/worktime/delete",
      data: {worktimeCode: workTimeCode},
      success: res => {
        res.success ? callback && callback(res) : me.tools.rzhAlt('error', '', SettingsService.I18NINFO.swat.e131);
      },
      error: res => {
        console.log(res);
      }
    });
  };

  /**
   * 获取没有绑定教师列表
   * @returns {Array}      返回没有绑定教师数据
   */
  getNoBindTutor() {
    let me = this, result = [];
    me.ajax.get({
      url: '/tutor/notbind',
      async: false,
      success: res => {
        res.success ? result = res.data || [] : me.tools.rzhAlt('error', '', SettingsService.I18NINFO.assistant.detailsErr);
      },
      error: res => {
        console.log(res);
      }
    })
    return result;
  }
};

/**
 * 定义教师工作时间的数据格式
 */
export class Week{
  tutorCode: string;
  startTime: string;
  endTime: string;
  week: string;
  state: string;
  constructor(tutorCode: string, startTime: string, endTime: string, week: string) {
    this.tutorCode = tutorCode;
    this.startTime = startTime;
    this.endTime = endTime;
    this.week = week;
    this.state = 'available';
  };
};

