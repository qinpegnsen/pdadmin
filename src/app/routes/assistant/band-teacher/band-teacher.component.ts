import { Component, OnInit } from '@angular/core';
import {AssistantService} from "../assistant.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-band-teacher',
  templateUrl: './band-teacher.component.html',
  styleUrls: ['./band-teacher.component.scss']
})
export class BandTeacherComponent implements OnInit {
  private assisCode: string;                  // 助教编码
  private AssistantDetail: any;               // 助教详细信息（非实时）
  private tutors: Array<any> = new Array();   // 未绑定教师列表

  constructor(public assis: AssistantService, public route: ActivatedRoute, public router: Router) { }

  ngOnInit() {
    this.assisCode = this.getassisCode();                                       // 初始化助教编码
    this.updata();
  }

  /**
   * 获取数据
   */
  updata() {
    this.AssistantDetail = this.assis.getAssistantDetail(this.assisCode);       // 初始化助教详细信息
    this.tutors = this.assis.getNoBindTutor();                                    // 获取教师列表
  }

  /**
   * 获取URL中助教编码
   * @returns {string}     返回助教编码
   */
  private getassisCode() {
    let assistantCode: string;
    this.route.params.subscribe(params => {
      assistantCode = params['assistantCode'];
    });
    return assistantCode;
  }

  /**
   * 为助教绑定教师
   * @param e     要绑定的教师数据
   */
  bandTeacher(e){
    this.assis.addAtutors(this.assisCode, e.dragData.tutorCode, res => {
      this.updata();
    });
  }

  /**
   * 删除绑定教师
   * @param tutorCode        教师编码
   */
  delTeacher(tutorCode) {
    this.assis.modifyAssistantTutor(this.assisCode, tutorCode, res => {
      this.updata();
    });
  }

  /**
   * 返回上级页面
   */
  goBack() {
    let _this = this;
    _this.router.navigate(["/main/assis/assis/list"]);
  };

}
