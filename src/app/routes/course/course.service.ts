import {Injectable} from '@angular/core';
import {isNullOrUndefined} from "util";
import {AjaxService} from "../../core/services/ajax.service";
import {RzhtoolsService} from "../../core/services/rzhtools.service";
import {SettingsService} from "../../core/settings/settings.service";

@Injectable()
export class CourseService {
  public stateList;                                                              // 状态列表
  public courseGeneralTypeList;                                                              // 课程总类别
  public courseCalculateTypeList;                                                              // 课时费类型
  public isHotList;                                                             // 是否置为热门枚举列表

  constructor(private ajax: AjaxService, private tools: RzhtoolsService) {
    this.stateList = this.tools.getEnumDataList('1007');                         // 初始化状态
    this.courseGeneralTypeList = this.tools.getEnumDataList('1031');                         // 初始化状态
    this.courseCalculateTypeList = this.tools.getEnumDataList('1033');                         // 课时费类型
    this.isHotList = this.tools.getEnumDataList('1034');                         // 是否置为热门枚举列表
  }

  /**
   * 添加课程体系
   * @param CategoryData       //课程体系数据
   * @param callback           //成功回调
   */
  addCategory(CategoryData: any, callback?: any) {
    const me = this;
    me.ajax.post({
      url: '/course/category/add',
      data: CategoryData,
      success: res => {
        if(res.success){
          callback && callback(res)
        }else{
          if(res.data.code==4006){
            me.tools.rzhAlt('error', '', SettingsService.I18NINFO.swat.e146);
          }else{
            me.tools.rzhAlt('error', '', SettingsService.I18NINFO.swat.e128);
          }
        }
      },
      error: res => {
        me.tools.rzhAlt('error', '', SettingsService.I18NINFO.swat.e128);
      }
    });
  };

  /**
   * 添加课程
   * @param courseData       //课程数据
   * @param callback         //成功回调
   */
  addCourse(courseData: any, callback: any) {
    const me = this;
    me.ajax.post({
      url: '/course/add',
      data: courseData,
      success: res => {
        if( res.success){
          callback && callback(res)
        }else{
          if(res.data.code==9004){
            me.tools.rzhAlt('error', '', SettingsService.I18NINFO.swat.e140);
          }else if(res.data.code==4006){
            me.tools.rzhAlt('error', '', SettingsService.I18NINFO.swat.e146);
          }else{
            me.tools.rzhAlt('error', '', SettingsService.I18NINFO.swat.e128);
          }
        }
      },
      error: res => {
        console.log(res);
      }
    });
  };

  /**
   * 获取课程体系
   * @param {string} curPage       //当前页
   * @param {string} pageSize      //分页大小
   * @param {string} state         //课程体系状态
   * @returns {any}                //返回课程体系对象
   */
  getCategory(requestParmas: any, state: string = '') {
    let result = {voList: []};
    const me = this;
    me.ajax.get({
      url: '/course/category/list',
      data: {
        curPage: requestParmas.curPage,
        pageSize: requestParmas.pageSize,
        state: state
      },
      async: false,
      success: res => {
        res.success ? result = res.data || {voList: []} : me.tools.rzhAlt('error', '', SettingsService.I18NINFO.swat.e134);
      },
      error: res => {
        console.log(res);
      }
    });
    return result;
  };

  /**
   * 查询获取课程
   * @param searchData            // 查询条件
   * @param {string} curPage      // 当前页
   * @param {string} pageSize     // 分页大小
   * @returns {any}               //返回课程对象
   */
  getCourseList(requestParmas: any, searchData?: any) {
    const courseData = {
      categoryCode: '',
      duration: '',
      studentNum: '',
      courseHour: '',
      state: '',
      curPage: requestParmas.curPage,
      pageSize: requestParmas.pageSize
    };
    Object.assign(courseData, searchData);
    let result = {voList: []};
    const me = this;
    me.ajax.get({
      url: '/course/list',
      data: courseData,
      async: false,
      success: res => {
        res.success ? result = res.data || {voList: []} : me.tools.rzhAlt('error', '', SettingsService.I18NINFO.swat.e134);
      },
      error: res => {
        console.log(res);
      }
    });
    return result;
  };

  /**
   * 修改课程体系信息
   * @param newDate                    //新的课程体系数据
   * @param {string} categoryCode      //要修改的课程体系编码
   * @param callback                   //成功回调
   */
  modifyCategory(newDate: any, categoryCode: string, callback?: any) {
    const categoryData = {categoryCode: categoryCode, category: '', superCode: '', state: ''};
    const me = this;
    Object.assign(categoryData, newDate);
    me.ajax.put({
      url: '/course/category/modify',
      data: categoryData,
      success: res => {
        res.success ? callback && callback(res) : me.tools.rzhAlt('error', '', SettingsService.I18NINFO.swat.e125);
      },
      error: res => {
        console.log(res);
      }
    });
  };

  /**
   * 修改课程信息
   * @param newDate                //新的课程数据
   * @param {string} courseCode    //要修改的课程编码
   * @param callback               //成功回调
   */
  modifyCourse(newDate: any, courseCode: string, callback: any) {
    const courseData = {
      courseCode: courseCode,
      course: newDate.course,
      categoryCode: newDate.categoryCode,
      duration: newDate.duration,
      studentNum: newDate.studentNum,
      courseHour: newDate.courseHour,
      summary: newDate.summary,
      courseGeneralType:newDate.courseGeneralType,
      courseCalculateType:newDate.courseCalculateType,
      // ponddyletId: newDate.ponddyletId,
      state: newDate.state,
      isHot: newDate.isHot
    };
    const me = this;
    me.ajax.put({
      url: '/course/modify',
      data: courseData,
      success: res => {
        if( res.success){
          callback && callback(res)
        }else{
          if(res.data.code==9004){
            me.tools.rzhAlt('error', '', SettingsService.I18NINFO.swat.e140);
          }else if(res.data.code==4006){
            me.tools.rzhAlt('error', '', SettingsService.I18NINFO.swat.e147);
          }else{
            me.tools.rzhAlt('error', '', SettingsService.I18NINFO.swat.e125);
          }
        }
      },
      error: res => {
        console.log(res);
      }
    });
  };

  /**
   * 查询可用课程列表
   * @returns {any} //返回课程列表
   */
  coursesactive() {
    let result: Array<any> = new Array();
    const me = this;
    me.ajax.get({
      url: '/course/active/list',
      async: false,
      success: res => {
        res.success ? result = res.data : me.tools.rzhAlt('error', '', SettingsService.I18NINFO.swat.e104);
      },
      error: res => {
        console.log(res);
      }
    });
    return result;
  };

  /**
   * 获取课程详情
   * @param code          课程编码
   * @returns {any}       返回课程详情数据
   */
  getCourse(code) {
    let me = this;
    let result;
    me.ajax.get({
      url: '/course/load',
      data: {courseCode: code},
      async: false,
      success: res => {
        if(res.success){
          result = res.data || {};
        }else {
          me.tools.rzhAlt('error', SettingsService.I18NINFO.course.getDetailErr);
        }
      },
      error: res => {
        console.log(res);
      }
    });
    return result;
  };

  /**
   * 添加课件
   * @param data       添加课件数据
   * @param type       课件文件类型
   * @param callback     成功回调
   */
  addCourseware(data: any, type: string, callback: any) {
    let me = this;
    data.type = type;
    me.ajax.post({
      url: '/courseware/add',
      data: data,
      success: res => {
        if(res.success) {
          callback(res);
        }else {
          me.tools.rzhAlt('error', SettingsService.I18NINFO.course.addWareErr);
        }
      },
      error: res => {
        console.log(res);
      }
    });
  };

  /**
   * 修改课件信息
   * @param data      要修改的课件信息
   * @param coursewareCode   课件编码
   * @param callback    成功回调
   */
  modifyCourseWare(data: any, coursewareCode: string, callback?: any) {
    let me = this;
    data.coursewareCode = coursewareCode
    me.ajax.put({
      url: '/courseware/modify',
      data: data,
      success: res => {
        if(res.success) {
          callback && callback(res);
        }else {
          me.tools.rzhAlt('error', SettingsService.I18NINFO.course.modifyWareErr);
        }
      },
      error: res => {
        console.log(res);
      }
    });
  };

  /**
   * 添加课件文件
   * @param coursewareCode      课件编码
   * @param uid      文件uid
   * @param callback    成功回调
   */
  bandCourseware(coursewareCode: string, uid: string, callback: any) {
    let me = this;
    me.ajax.put({
      url: '/courseware/courseware',
      data: {coursewareCode: coursewareCode, uid: uid},
      success: res => {
        if(res.success) {
          callback(res);
        }else {
          me.tools.rzhAlt('error', SettingsService.I18NINFO.course.addWareErr);
        };
      }
    });
  };

  /**
   * 获取课程分类下的课件列表
   * @param categoryCode     课程分类编码
   * @param curPage        当前页
   * @param pageSize        分页大小
   */
  getCoursewareList(curPage: number, pageSize: number, categoryCode?: string) {
    let me = this;
    let result;
    me.ajax.get({
      url: '/courseware/list',
      data: {categoryCode: categoryCode || '', curPage: curPage, pageSize: pageSize},
      async: false,
      success: res => {
        if(res.success){
          result = res.data || {};
        }else {
          me.tools.rzhAlt('error', SettingsService.I18NINFO.course.getWareListErr);
        }
      },
      error: res => {
        console.log(res);
      }
    });
    return result;
  };

  /**
   * 为课程添加课件
   * @param courseCode         课程编码
   * @param coursewareCode    课件编码
   * @param callback  成功回调
   */
  addCoursewareForCourse(courseCode: string, coursewareCode: string, callback?: any) {
    let me = this;
    me.ajax.post({
      url:'/courseware/course/add',
      data: {courseCode: courseCode, coursewareCode: coursewareCode},
      success: res => {
        if(res.success) {
          callback && callback(res);
        }else {
          me.tools.rzhAlt('error', SettingsService.I18NINFO.course.addWareForCourseErr)
        };
      },
      error: res => {
        console.log(res);
      }
    });
  };

  /**
   * 删除课程的课件
   * @param courseCode         课程编码
   * @param coursewareCode    课件编码
   * @param callback  成功回调
   */
  delCoursewareForCourse(courseCode: string, coursewareCode: string, callback?: any) {
    let me = this;
    me.ajax.post({
      url:'/courseware/course/delete',
      data: {courseCode: courseCode, coursewareCode: coursewareCode},
      success: res => {
        if(res.success) {
          callback && callback(res);
        }else {
          me.tools.rzhAlt('error', SettingsService.I18NINFO.course.delWareForCourseErr)
        };
      },
      error: res => {
        console.log(res);
      }
    });
  };

  /**
   * 删除课件
   * @param coursewareCode    课件编码
   * @param callback    成功回调
   */
  deleteWare(coursewareCode: string, callback?: any) {
    let me = this;
    me.ajax.del({
      url: '/courseware/delete',
      data: {coursewareCode: coursewareCode},
      success: res => {
        if(res.success) {
          callback && callback(res);
        }else {
          me.tools.rzhAlt('error', SettingsService.I18NINFO.course.deleteWareErr);
        }
      },
      error: res => {
        console.log(res);
      }
    });
  };
}
