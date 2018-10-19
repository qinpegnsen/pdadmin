import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CourseService} from "../course.service";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";

@Component({
  selector: 'app-band-course-ware',
  templateUrl: './band-course-ware.component.html',
  styleUrls: ['./band-course-ware.component.scss']
})
export class BandCourseWareComponent implements OnInit {
  private code: string;        // 课程编码
  private courseData: any = {};          // 课程数据
  private coursewareList: Array<any> = new Array();  // 课程体系下全部课件数据
  private coursewares: Array<any> = new Array();     // 课程体系下为被本课程绑定课件数据

  constructor(private route: ActivatedRoute, private router: Router, private course: CourseService, private tools: RzhtoolsService) { }

  ngOnInit() {
    this.code = this.route.snapshot.queryParams['code'];        // 获取课程编码
    if(!this.code){                 // 课程编码不存在返回课程列表页
      this.router.navigate(['/main/cour/course']);
    };
    this.getCourse();
    this.getCoursewareList();
    this.getCoursewares();
  };

  /**
   * 获取课程详情
   */
  getCourse() {
    this.courseData = this.course.getCourse(this.code);
  };

  /**
   * 获取课件列表
   */
  getCoursewareList() {
    this.coursewareList = this.course.getCoursewareList(1, 1000, this.courseData.categoryCode).voList;
  };

  /**
   * 获取为绑定课件
   */
  getCoursewares() {
    let courseWares = JSON.parse(JSON.stringify(this.courseData.courseCourseWares));
    this.coursewares = this.tools.arrayWeightingOfObject( courseWares || [], this.coursewareList || [], 'coursewareCode');
  };

  /**
   * 绑定课件
   * @param e
   */
  bandCourseware(e){
    this.course.addCoursewareForCourse(this.courseData.courseCode, e.dragData.coursewareCode, res => {
      this.getCourse();
      this.getCoursewares();
    });
  };

  /**
   * 删除绑定课件
   * @param code
   */
  delCourseWare(code) {
    this.course.delCoursewareForCourse(this.courseData.courseCode, code, res => {
      this.getCourse();
      this.getCoursewares();
    });
  }

  /**
   * 返回上级页面
   */
  goBack() {
    this.router.navigate(["/main/cour/course"]);
  };

}
