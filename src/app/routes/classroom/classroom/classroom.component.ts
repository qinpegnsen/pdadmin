import { Component, OnInit } from '@angular/core';
import {RzhtoolsService} from '../../../core/services/rzhtools.service';
import {AssistantService} from '../../assistant/assistant.service';
import {Page} from '../../../core/page/page';
import {PageEvent} from '../../../shared/directives/ng2-datatable/DataTable';
import {isNullOrUndefined} from "util";
import {ClassroomService} from "../classroom.service";
import {Router, ActivatedRoute} from "@angular/router";
import {SettingsService} from "../../../core/settings/settings.service";
const swal = require('sweetalert');
@Component({
  selector: 'app-classroom',
  templateUrl: './classroom.component.html',
  styleUrls: ['./classroom.component.scss']
})
export class ClassroomComponent implements OnInit {
  private classData: Page = new Page();     // 课堂信息
  private assisList: Array<any> = new Array();     // 助教列表
  private teacherList: Array<any> = new Array();   // 教师列表
  private stateList: Array<any> = new Array();      // 状态列表
  public initSearch = {assistantCode: '', tutorCode: '', state: ''};       // 默认搜索
  private search = {assistantCode: '', tutorCode: '', state: ''};       // 初始化搜索
  public custom:string = SettingsService.custom; //自定义预约类型

  constructor(private tools: RzhtoolsService, private assis: AssistantService, private classroom: ClassroomService, private router: Router, private route: ActivatedRoute,private settingsService: SettingsService) { }

  ngOnInit() {
    let _this = this,state = _this.route.snapshot.queryParams['state']; //路由中获取上页列表的查询信息
    const assisData = _this.assis.getAssistant('1', '1000');   // 获取助教列表
    _this.assisList = assisData.voList || [];
    !isNullOrUndefined(state)? _this.search.state = state: _this.search = _this.classroom.searchData;
    _this.teacherList = _this.assis.getTutorsAll();     // 获取教师列表
    _this.stateList = _this.tools.getEnumDataList('1003');    // 获取课堂状态列表
    _this.getData(_this.search);    // 初始化获取课堂信息
  };

  /**
   * 过滤出出席学生的列表
   */
  getAttendStudents(result){
    let arr=new Array();
    if(result.classroomStudentses.length>0){
      for(let i=0;i<result.classroomStudentses.length;i++){
        if(result.classroomStudentses[i].state=='Attend'){
          arr.push(result.classroomStudentses[i])
        }
      }
    }
    return arr;
  }

  /**
   * 获取课堂信息列表
   * @param data     搜索数据
   * @param {PageEvent} event     页码对象
   */
  getData(data?: any, event?: PageEvent) {
    const me = this;
    me.search = Object.assign({}, data);
    let activePage = event ? event.activePage : 1;
    if (!isNullOrUndefined(event)) {
      sessionStorage.setItem('roomCurPage',String(event.activePage));
    }
    const pageSize = me.classData.pageSize || 25;
    if (data) me.classroom.searchData = Object.assign({}, data);
    const result = me.classroom.getClassroom(Number(sessionStorage.getItem('roomCurPage'))||activePage, pageSize, me.classroom.searchData);
    me.classData = new Page(result);
  };

  /**
   * 进入详情页
   * @param classroomCode  课堂编码
   * @param tutorCode    老师编码
   */
  toDetail(classroomCode, tutorCode) {
    this.classroom.selRoom.classroomCode = classroomCode;
    this.classroom.selRoom.tutorCode = tutorCode;
    this.router.navigate(['/main/room/detail',classroomCode,tutorCode,false]);
  };

  /**
   * 取消课程
   */
  cancelCourse(classroomCode,tutorCode){
    let me=this;
    swal({
        title: SettingsService.I18NINFO.classroom.cancelAlertInfo,
        type: 'warning',
        text: SettingsService.I18NINFO.classroom.cancelAlert ,
        confirmButtonText: SettingsService.I18NINFO.swat.e121, //‘确认’按钮命名
        showCancelButton: true, //显示‘取消’按钮
        cancelButtonText: SettingsService.I18NINFO.swat.e122, //‘取消’按钮命名
        animation: 'slide-from-top', //头部滑下来
        closeOnConfirm: false  //点击‘确认’后，执行另外一个提示框
      },
      function () {  //点击‘确认’时执行
        let result=me.classroom.goCancelCourse(classroomCode,tutorCode,me.settingsService.user.assistantCode);
        if(result.success){
          swal.close();
          me.getData(me.search);    // 初始化获取课堂信息
        }
      }
    );
  }

}
