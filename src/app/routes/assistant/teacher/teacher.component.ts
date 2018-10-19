import { Component, OnInit } from '@angular/core';
import {AssistantService} from '../assistant.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent implements OnInit {

  public teacherData;                // 老师信息数据
  public addOpen = false;            // 右侧开关

  constructor(private assis: AssistantService, private router: Router) {
  }

  ngOnInit() {
    this.getTeacher();                       //初始化教师信息
  };

  /**
   * 获取老师信息
   */
  getTeacher() {
    let num:number=Number(sessionStorage.getItem('assisTuorCurPage'))||1;
    this.teacherData = this.assis.searchTutors('1',String(num*15));
  };

  /**
   * 更新老师信息
   */
  updateTeacher() {
    const curPage = this.teacherData.curPage;
    let result: Array<any> = new Array();
    for (let i = 1; i <= curPage; i++) {
      result = result.concat(this.assis.searchTutors(i + '', this.teacherData.pageSize).voList);
    }
    ;
    this.teacherData = this.assis.searchTutors(curPage + '', this.teacherData.pageSize);
    this.teacherData.voList = result;
  };

  /**
   * 加载更多
   */
  loadMore() {
    const curPage = ++this.teacherData.curPage;
    sessionStorage.setItem('assisTuorCurPage', String(curPage));
    const data = this.assis.searchTutors(curPage + '', this.teacherData.pageSize);
    data.voList = this.teacherData.voList.concat(data.voList);
    this.teacherData = data;
  };

  /**
   * 开启或关闭
   * @constructor
   */
  OpenOrClose() {
    this.addOpen = !this.addOpen;
  };

  /**
   * 跳转至详情
   * @param teacherCode   教师编码
   */
  goDetail(teacherCode) {
    this.router.navigate(['/main/assis/teach/detail', teacherCode]);
  };

  /**
   * 跳转至教师绑定课程
   * @param teacherCode   教师编码
   */
  addCourse(teacherCode) {
    this.router.navigate(['/main/assis/teach/addCourse', teacherCode]);
  };

}
