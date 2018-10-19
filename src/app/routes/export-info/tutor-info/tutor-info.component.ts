import {Component, OnInit} from '@angular/core';
import {Page} from "../../../core/page/page";
import {ExportInfoService} from "../export-info.service";
import {PageEvent} from "angular2-datatable";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {AppComponent} from "../../../app.component";
import {SettingsService} from "../../../core/settings/settings.service";

@Component({
  selector: 'app-tutor-info',
  templateUrl: './tutor-info.component.html',
  styleUrls: ['./tutor-info.component.scss']
})
export class TutorInfoComponent implements OnInit {
  private data: Page = new Page();                  //模板列表预览数据
  private teacherList: Array<any> = new Array();   // 教师列表
  private courseData: any;                         // 老师课程数据
  private courseGeneralType: string='1031';        // 课程要求的枚举
  private stateList: Array<any> = new Array();      // 课堂状态列表
  private search: any = {
    tutorCode: '',
    createTimeBegin: '',
    createTimeEnd: '',
    courseCode: '',
    state: '',
  };                                        // 搜索条件
  constructor(private exportInfoService: ExportInfoService, private tools: RzhtoolsService) {
  }

  ngOnInit() {
    let _this = this;
    _this.teacherList = _this.exportInfoService.getTutorsAll();     // 获取教师列表
    let stateList = _this.tools.getEnumDataList('1003');
    _this.resetStateLsit(stateList);                        //状态
    _this.data = new Page(_this.exportInfoService.queryTutorTemList(1, 10, _this.search)); //初始化查询列表
  }

  /**
   *选择老师后才可以选择课程
   */
  selectTutor(){
    this.search.courseCode='';                             //重置课堂编码
    this.getCourse();                                      //课堂
  }

  /**
   * 重置搜索条件
   */
  clearInfo(){
    this.search={
      tutorCode: '',
      createTimeBegin: '',
      createTimeEnd: '',
      courseCode: '',
      state: '',
    };
    this.data = new Page(this.exportInfoService.queryTutorTemList(1, 10, this.search)); //初始化查询列表
  }

  /**
   * 对课堂的状态进行重组
   */
  resetStateLsit(data) {
    let tempArr: any = new Array;
    for (let item of data) {
      if (item.key == 'Premature' || item.key == 'Ended') {
        tempArr.push(item)
      }
    }
    this.stateList = tempArr;
  }

  /**
   * 搜索模板信息
   */
  searchInfo() {
    let _this=this;
    _this.data = new Page(_this.exportInfoService.queryTutorTemList(1, 10, _this.search)); //初始化查询列表
  }

  /**
   * 导出模板信息
   */
  export() {
    let me=this;
    me.searchInfo();
    var data = {
      "title": ["教师别名","教师实名", "课程时间", "课程","课程要求", "课程状态", "上课时数", "出席学生", "缺席学生", "综合评分"
      ], "data": []
    };
    const requestParmas = {
      tutorCode: me.search ? me.search.tutorCode : '',
      courseCode: me.search ? me.search.courseCode : '',
      startStr: me.search ? me.search.createTimeBegin : '',
      endStr: me.search ? me.search.createTimeEnd : '',
      state: me.search ? me.search.state : '',
    };
    let exportData = me.exportInfoService.exportTutorTemList(requestParmas);     //导出和搜索的区别在于导出没有分页，其他都是一样的
    for(let item of exportData){
      let arr=new Array();
      arr.push(item.tutorName,item.eName,item.courseTimeStr,item.courseName,me.getCourseRequirement(item.courseGeneralType),item.state,item.zoomCostTime,item.attendStudentStr,item.absentStudentStr,item.generalStar);
      arr[2]=me.transform(arr[2]);
      data.data.push(arr)
    }
    me.exportInfoService.JSONToExcelConvertor(data.data, "教师授课时数统计表", data.title)
  }

  /**
   * 时间转换并切割
   * @param value
   * @param args
   * @returns {string}
   */
  transform(value: any, args?: any): any {
    let arr=value.split('~'),result:string='';

    /**
     * 转化为当地时间并截取所需要的
     */
    for(let i=0;i<arr.length;i++){
      arr[i]=this.tools.UTCToDate(arr[i]);
      if(i==0){
        result+=arr[i]+"~"
      }else{
        result+=arr[i].substr(11,18)
      }
    }
    return result;
  }

  /**
   * 重组的课程需求
   */
  getCourseRequirement(courseGeneralType){
    let me=this,result='';
    for(let i=0;i<courseGeneralType.split('、').length;i++){
      result+=me.tools.getEnumDataValByKey(me.courseGeneralType,courseGeneralType.split('、')[i])
      if(i!=courseGeneralType.split('、').length-1){
        result+='、'
      }
    }
    return result
  }

  /**
   * 获取课程数据
   * @param {PageEvent} event      Page事件对象
   */
  getCourse() {
    let me=this;
    const requestParmas = {
      curPage: '1',
      pageSize: '999',
      tutorCode:me.search.tutorCode
    };
    const result = me.exportInfoService.getTutorCourseList(requestParmas); // 获取课程分类信息
    me.courseData = result;
  };

  /**
   * 点击课堂的提示
   */
  getTip(){
    if(!this.search.tutorCode){
      AppComponent.rzhMsg('info',SettingsService.I18NINFO.timetable.selectTutor)
    }else if(this.search.tutorCode&&this.courseData.length==0){
      AppComponent.rzhMsg('info',SettingsService.I18NINFO.timetable.linkCourse)
    }
  }

  /**
   * 获取老师模板数据
   * @param data     搜索数据
   * @param {PageEvent} event     页码对象
   */
  getData(event?: PageEvent) {
    const _this = this;
    // me.getCourse(event);
    _this.data = new Page(_this.exportInfoService.queryTutorTemList(event.activePage, 10, _this.search)); //初始化查询列表
  };

}
