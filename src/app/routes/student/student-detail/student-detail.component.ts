import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {StudentService} from "../student.service";
import {Location} from '@angular/common';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.scss']
})
export class StudentDetailComponent implements OnInit {
  private code: string;
  private studentData: any;

  constructor(private route: ActivatedRoute, public student: StudentService, public location: Location) {
  }

  ngOnInit() {
    this.code = this.route.snapshot.queryParams['code'];
    this.studentData = this.student.getStudentDetail(this.code);
  }

  /**
   * 返回上一步
   */
  goBack() {
    this.location.back();
  };

  /**
   * 把字符串转化为json对象
   */
  stringToJson(str) {
    if(str){
      let arr=JSON.parse(str);
      let bol=arr.every(this.checkNull);
      if(bol){
        return ['暂无信息']
      }else{
        return JSON.parse(str)
      }
    }else{
      return ['暂无信息']
    }
  }

  /**
   * 检测数组里面的数据是否都是null
   */
  checkNull(value){
    return value==null;
  }
}
