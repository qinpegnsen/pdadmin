import {Component, OnInit} from '@angular/core';
import {Page} from "../../../core/page/page";
import {ExportInfoService} from "../export-info.service";
import {PageEvent} from "angular2-datatable";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
@Component({
  selector: 'app-stu-info',
  templateUrl: './stu-info.component.html',
  styleUrls: ['./stu-info.component.scss']
})
export class StuInfoComponent implements OnInit {

  private data: Page = new Page();                  //模板列表预览数据
  private stuList: Array<any> = new Array();        // 学生列表
  private courseData: any = new Array();            // 课程分类数据
  private stateList: Array<any> = new Array();      // 学生状态列表
  private search: any = {
    stuCode: '',
    createTimeBegin: '',
    createTimeEnd: '',
    courseCode: '',
    state: '',
  };                                        // 搜索条件
  constructor(private exportInfoService: ExportInfoService, private tools: RzhtoolsService) {
  }

  ngOnInit() {
    let _this = this;
    _this.stuList = _this.exportInfoService.getStusAll();     // 获取学生列表
    this.stateList = _this.tools.getEnumDataList('1030');      //学生状态
    _this.getCourse();                                      //课堂
    _this.data = new Page(_this.exportInfoService.queryStuTemList(1, 10, _this.search)); //初始化查询列表
  }


  /**
   * 重置搜索条件
   */
  clearInfo() {
    this.search = {
      stuCode: '',
      createTimeBegin: '',
      createTimeEnd: '',
      courseCode: '',
      state: '',
    };
    this.data = new Page(this.exportInfoService.queryStuTemList(1, 10, this.search)); //初始化查询列表
  }

  /**
   * 搜索模板信息
   */
  searchInfo() {
    let _this = this;
    _this.data = new Page(_this.exportInfoService.queryStuTemList(1, 10, _this.search)); //初始化查询列表
  }

  /**
   * 导出模板信息
   */
  export() {
    this.searchInfo();
    var data = {
      "title": ["学生姓名", "教师别名", "教师实名", "课程时间", "课程", "课程状态", "学生评分", "学生评论"
      ], "data": []
    };
    const requestParmas = {
      studentCode: this.search ? this.search.stuCode : '',
      courseCode: this.search ? this.search.courseCode : '',
      startStr: this.search ? this.search.createTimeBegin : '',
      endStr: this.search ? this.search.createTimeEnd : '',
      state: this.search ? this.search.state : '',
    };
    let exportData = this.exportInfoService.exportStuTemList(requestParmas);
    for (let item of exportData) {
      let arr = new Array();
      arr.push(item.studentName, item.tutorName, item.eName, item.courseTimeStr, item.courseName, item.state, item.studentStar, item.feedback);
      data.data.push(arr)
    }
    this.exportInfoService.JSONToExcelConvertor(data.data, "学生信息统计表", data.title)
  }

  /**
   * 获取课程数据
   * @param {PageEvent} event      Page事件对象
   */
  getCourse() {
    let me = this;
    const requestParmas = {
      curPage: '1',
      pageSize: '999',
    };
    const result = me.exportInfoService.getCourseList(requestParmas); // 获取课程分类信息
    me.courseData = (new Page(result)).voList;
  };


  /**
   * 获取老师模板数据
   * @param data     搜索数据
   * @param {PageEvent} event     页码对象
   */
  getData(event?: PageEvent) {
    const _this = this;
    // me.getCourse(event);
    _this.data = new Page(_this.exportInfoService.queryStuTemList(event.activePage, 10, _this.search)); //初始化查询列表
  };

}
