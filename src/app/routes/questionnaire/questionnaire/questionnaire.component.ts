import { Component, OnInit } from '@angular/core';
import {AssistantService} from '../../assistant/assistant.service';
import {Page} from '../../../core/page/page';
import {PageEvent} from '../../../shared/directives/ng2-datatable/DataTable';
import {Router} from "@angular/router";
import {ClassroomService} from "../../classroom/classroom.service";
import {QuestionnaireService} from "../questionnaire.service";
import {RzhtoolsService} from "app/core/services/rzhtools.service";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss']
})
export class QuestionnaireComponent implements OnInit {
  private classData: Page = new Page();     // 搜索出来的信息
  private teacherList: Array<any> = new Array();   // 教师列表
  private courseData: Array<any> = new Array();   // 课程信息
  private initSearch = {tutorCode: '', createTimeBegin: '', createTimeEnd: '',courseCode:''};       // 默认搜索
  private search: any = {
    tutorCode: '',
    createTimeBegin: '',
    createTimeEnd: '',
    courseCode: '',
  };                                        // 搜索条件

  constructor( private assis: AssistantService, private classroom: ClassroomService, private router: Router,private questionnaireService:QuestionnaireService,private tools: RzhtoolsService) { }

  ngOnInit() {
    let _this=this;
    _this.teacherList = _this.assis.getTutorsAll();     // 获取教师列表
    _this.getCourse();             //获取课程列表
    _this.getData(_this.search);    // 获取搜索到的信息
  };

  /**
   * 获取搜索信息列表
   * @param data     搜索数据
   * @param {PageEvent} event     页码对象
   */
  getData(data?: any, event?: PageEvent) {
    const me = this;
    me.search = Object.assign({}, data);
    let activePage = event ? event.activePage : 1;
    if (!isNullOrUndefined(event)) {
      sessionStorage.setItem('questionnarePage',String(event.activePage));
    }
    const pageSize = me.classData.pageSize || 10;
    const result = me.questionnaireService.getQuestionnaireRecordList(Number(sessionStorage.getItem('questionnarePage'))||activePage, pageSize,me.search);
    me.classData = new Page(result);
  };


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
    const result = me.questionnaireService.getCourseList(requestParmas); // 获取课程分类信息
    me.courseData = (new Page(result)).voList;
  };

  /**
   * 进入选择题详情页
   * @param classroomCode  课堂编码
   * @param tutorCode    老师编码
   */
  toDetail(classroomCode, tutorCode) {
    this.classroom.selRoom.classroomCode = classroomCode;
    this.classroom.selRoom.tutorCode = tutorCode;
    this.router.navigate(['/main/questionnaire/detail',classroomCode,tutorCode]);
  };

  /**
   * 进入问答题详情页
   * @param classroomCode  课堂编码
   * @param tutorCode    老师编码
   */
  toClassDetail(classroomCode, tutorCode) {
    this.classroom.selRoom.classroomCode = classroomCode;
    this.classroom.selRoom.tutorCode = tutorCode;
    this.router.navigate(['/main/room/detail',classroomCode,tutorCode,true]);
  };
}
