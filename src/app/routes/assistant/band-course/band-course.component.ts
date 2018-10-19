import { Component, OnInit } from '@angular/core';
import {AssistantService} from "../assistant.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";

@Component({
  selector: 'app-band-course',
  templateUrl: './band-course.component.html',
  styleUrls: ['./band-course.component.scss']
})
export class BandCourseComponent implements OnInit {
  teacherCode: string;   // 老师编码
  teacherDetail: any;
  courseList: Array<any> = new Array(); //课程列表
  coursesTypeList: Array<any> = new Array(); //课程体系列表
  showSelectType:boolean; //显示、隐藏课程类型选择
  selectCourseTypeInfo:string = null; //选中的课程类型名
  selectCourseTypeCode: string = null;             // 选中课程类型编码
  bandCourseList: Array<any> = new Array();       // 教师绑定课程列表

  constructor(public assis: AssistantService, public route: ActivatedRoute, public tools: RzhtoolsService, public router:Router) {
  }

  ngOnInit() {
    this.teacherCode = this.getTeacherCode();     // 初始化老师编码
    this.teacherDetail = this.assis.getTutorMore(this.teacherCode);
    this.coursesTypeList = this.assis.coursesTypeList();    //获取课程体系信息
    this.getCourse(this.coursesTypeList[0].categoryCode, this.coursesTypeList[0].category);     //  初始化教师未绑定课程数据
  }

  /**
   * 通过URL获取老师编码
   * @returns {string}              返回老师编码
   */
  getTeacherCode() {
    let teacherCode: string;
    this.route.params.subscribe(params => {
      teacherCode = params['teacherCode'];
    });
    return teacherCode;
  }

  /**
   * 显示、隐藏类型选择
   */
  showOrHideSelectType(){
    let _this = this;
    _this.showSelectType = !this.showSelectType;
  }

  /**
   * 选中类型，动态加载类型下数据信息
   * @param categoryCode 类型code
   * @param category 类型名
   */
  selectCourseType(categoryCode,category){
    let _this = this;
    _this.showOrHideSelectType();
    _this.getCourse(categoryCode, category);
  }

  /**
   * 更具课程分类获取课程
   * @param categoryCode         课程分类编码
   * @param category               课程分类名称
   */
  getCourse(categoryCode, category) {
    this.selectCourseTypeInfo = category;
    this.selectCourseTypeCode = categoryCode;
    let courses = this.assis.coursesList(categoryCode); //获取课程列表
    let bandCourses = this.assis.getTutorMore(this.teacherCode);      // 同上
    let bandCoursesCopy = Object.assign([],bandCourses.tutorCourses);
    this.bandCourseList = Object.assign([],bandCourses.tutorCourses);
    if(bandCoursesCopy){
      this.courseList =  this.tools.arrayWeightingOfObject(bandCoursesCopy, courses, 'courseCode')
    }else {
      this.courseList = courses;
    }
  }

  /**
   * 返回上级页面
   */
  goBack() {
    let _this = this;
    _this.router.navigate(["/main/assis/teach/list"]);
  };

  /**
   * 为教师绑定课程
   * @param e   拖拽的课程数据
   */
  bandCourse(e){
    this.assis.addTutorCourse(this.teacherCode, e.dragData.courseCode, res => {
      this.getCourse(this.selectCourseTypeCode, this.selectCourseTypeInfo);
    })
  }

  /**
   * 删除教师绑定课程
   * @param courseCode        课程编码
   */
  delCourse(courseCode) {
    this.assis.deleteCourse(this.teacherCode, courseCode, res => {
      this.getCourse(this.selectCourseTypeCode, this.selectCourseTypeInfo);
    });
  }

}
