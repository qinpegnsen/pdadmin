import {Component, OnInit} from '@angular/core';
import {ClassroomService} from "../classroom.service";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {SettingsService} from "../../../core/settings/settings.service";
import {DomSanitizer} from "@angular/platform-browser";
declare var $: any;

@Component({
  selector: 'app-classroom-detail',
  templateUrl: './classroom-detail.component.html',
  styleUrls: ['./classroom-detail.component.scss']
})
export class ClassroomDetailComponent implements OnInit {
  private classroomInfo: any = {};                  // 课堂信息数据
  private attendStuList: any = {};                  // 出席学生列表
  private absentStuList: any = {};                  // 缺席学生列表
  // private videoSrc: any;
  private bol:boolean=false;         //课堂反馈的标签页没有打开，默认是课堂追踪，只有在问卷调查跳转过来才激活这个
  messageArrLsit: any = [];                               //留言信息数据

  constructor(private classroom: ClassroomService, private tools: RzhtoolsService, private router: Router, private location: Location, public  sanitizer: DomSanitizer, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.classroomInfo = this.classroom.getClassroomInfo(this.getorderCode('classroomCode'), this.getorderCode('tutorCode'));
    // if (this.classroomInfo.classroomVideo && this.classroomInfo.classroomVideo.embeddedCode) {
    //   this.videoSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.classroomInfo.classroomVideo.embeddedCode.split("'")[3]);
    // }
    let bol=this.getorderCode('type');
    if(bol=='false'){
      this.bol=false;
    }else{
      this.bol=true;
    }
    this.attendStuList=this.getAttendStudents();
    this.absentStuList=this.getAbsentStudents();
    let result=this.classroom.tutorGetMessage(this.getorderCode('classroomCode'),this.getorderCode('tutorCode'),'Asia/Shanghai');
    if(result.length>0){
      this.resetMessage(result);
      setTimeout(() => {
        for (let i = 0; i < $(".messageScoll").length; i++) {
          $(".messageScoll").scrollTop($(".messageScoll")[i].scrollHeight);//让滚动条一直在最下面
        }
      });
    }
  };

  /**
   * 截取字符串并且判断是通已分钟的信息，不是同一分钟的显示时间
   * @param time  当前循环的时间
   * @param arr    数组
   * @param i   当前的下标
   */
  splitStr(time, arr, i) {
    if(i>0){
      if(arr[i-1].createTime.substr(0,16)!=time.substr(0,16)){
        return time.substr(0,16)
      }else{
        return null
      }
    }else{
      return time.substr(0,16)
    }
  }

  /**
   * 重组留言数据
   */
  resetMessage(result){
    for(let i=0;i<result.length;i++){
      for(let j=0;j<result[i].messageInfo.length;j++){
        if(result[i].messageInfo[j].sender=='TUTOR'){
          result[i].messageInfo[j].img=this.classroomInfo.classroomTutors[0].tutor.avatar;
        }else {
          for(let k=0;k<this.classroomInfo.classroomStudentses.length;k++){
            if(this.classroomInfo.classroomStudentses[k].studentCode==result[i].messageInfo[j].studentCode){
              result[i].messageInfo[j].img=this.classroomInfo.classroomStudentses[k].student.avatar;
            }
          }
        }
      }
    }
    this.messageArrLsit=result;
  }

  /**
   * 过滤出出席学生的列表
   */
  getAttendStudents(){
    let arr=new Array();
    if(this.classroomInfo.classroomStudentses.length>0){
      for(let i=0;i<this.classroomInfo.classroomStudentses.length;i++){
        if(this.classroomInfo.classroomStudentses[i].state=='Attend'){
          arr.push(this.classroomInfo.classroomStudentses[i])
        }
      }
    }
    return arr;
  }

  /**
   * 过滤出缺席学生的列表
   */
  getAbsentStudents(){
    let arr=new Array();
    if(this.classroomInfo.classroomStudentses.length>0){
      for(let i=0;i<this.classroomInfo.classroomStudentses.length;i++){
        if(this.classroomInfo.classroomStudentses[i].state=='Absent'){
          arr.push(this.classroomInfo.classroomStudentses[i])
        }
      }
    }
    return arr;
  }

  /**
   * 获取URL编码
   * @returns {string}     返回编码
   */
  public getorderCode(val) {
    let code: any;
    this.route.params.subscribe(params => {
      code = params[val];
    });
    return code;
  };

  /**
   * 返回上一步
   */
  goBack() {
    this.location.back();
  };

}
