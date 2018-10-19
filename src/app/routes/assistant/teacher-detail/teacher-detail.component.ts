import {Component, OnInit, ViewChild} from '@angular/core';
import {AssistantService, Week} from '../assistant.service';
import {ActivatedRoute, Router, NavigationEnd} from '@angular/router';
import {PatternService} from '../../../core/forms/pattern.service';
import {RzhtoolsService} from '../../../core/services/rzhtools.service';
import {SettingsService} from "../../../core/settings/settings.service";
import {CourseService} from "../../course/course.service";

@Component({
  moduleId: module.id,
  selector: 'app-teacher-detail',
  templateUrl: 'teacher-detail.component.html',
  styleUrls: ['teacher-detail.component.scss']
})
export class TeacherDetailComponent implements OnInit {
  private teacherCode: string;                       // 老师编码
  private teacherDetail: any = {};                        // 老师详细信息（非实时）
  private teacherDetailNew: any = {};                     // 老师详细信息（实时）
  private teacherState: Array<any>;                  // 老师状态
  private Gender: Array<any>;                        // 信息列表
  private timezones: Array<any>;                     // 时区列表
  private courseStateNum: number = 1007;             // 课程状态码
  private weekCode: number = 1008;                   // 星期状态码
  private weeks: Array<any> = new Array();           // 星期列表
  private weekList: Array<any> = new Array();         // 选中星期列表

  constructor(private assis: AssistantService, private route: ActivatedRoute, private patterns: PatternService, private tools: RzhtoolsService, private router: Router, public course: CourseService) {
  }

  ngOnInit() {
    this.teacherCode = this.getTeacherCode();                                    // 初始化老师编码
    this.teacherState = this.tools.getEnumDataList('1017');                      // 初始化老师状态
    this.Gender = this.tools.getEnumDataList('1001');                            // 初始化性别列表
    this.timezones = this.tools.getTimeZones();                                  // 初始化时区列表
    this.weeks = this.tools.getEnumDataList(this.weekCode);            // 初始化星期列表
    this.update();
    this.weeks.sort((a, b) => {
      return a.val - b.val;
    })
  }

  /**
   * 更新获取数据
   */
  update() {
    this.teacherDetail = this.assis.getTutorMore(this.teacherCode);         // 获取老师详细信息
    this.teacherDetailNew = this.assis.getTutorMore(this.teacherCode);      // 同上
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
   * 提交老师修改数据
   * @param update               老师修改数据
   */
  onSubmit(update) {
    if (update.valid) {
      const data = update.value;
      if (data.oldPossword && data.newPossword) this.assis.modifyPwd(this.teacherDetail.phone, data.oldPossword, data.newPossword, res => {
        this.tools.rzhAlt('success', SettingsService.I18NINFO.swat.e123, SettingsService.I18NINFO.swat.e124+"(pwd)");
      })
      if (this.teacherDetailNew.state !== this.teacherDetail.state) {
        this.assis.modifyState(this.teacherCode, this.teacherDetail.email, data.state, res => {
          this.tools.rzhAlt('success', SettingsService.I18NINFO.swat.e123, SettingsService.I18NINFO.swat.e124+"(state)");
          this.teacherDetailNew.state = data.state;
        });
      }
      if (this.teacherDetailNew.isAssess !== data.isAssess || this.teacherDetailNew.isConsult !== data.isConsult) {
        this.assis.modifyTutor(this.teacherDetail.tutorCode, data.isAssess, data.isConsult, res => {
          this.tools.rzhAlt('success', SettingsService.I18NINFO.swat.e123, SettingsService.I18NINFO.swat.e124);
          this.teacherDetailNew.isAssess = data.isAssess;
          this.teacherDetailNew.isConsult = data.isConsult;
        })
      }
    }
    ;
  };

  /**
   * 删除老师
   */
  deleteTutors() {
    this.assis.deleteTutor(this.teacherCode, this.teacherDetail.email);
    this.router.navigate(['/main/assis/teach/list']);
  };

  /**
   * 返回上级页面
   */
  goBack() {
    let _this = this;
    _this.router.navigate(["/main/assis/teach/list"]);
  };

  /**
   * 获取选中星期
   * @param e
   */
  selWeek(e) {
    let val = e.target.value, checked = e.target.checked, me = this;
    checked ? me.weekList.push(val) : me.weekList.indexOf(val) !== -1 && me.weekList.splice(me.weekList.indexOf(val), 1);
  }

  /**
   * 为老师添加工作时间
   * @param formData            要添加的工作时间顺序
   */
  addWorkTime(formData) {
    let me = this;
    if (formData.valid) {
      let startTime = formData.value.startTime, endTime = formData.value.endTime;
      if (endTime <= startTime) {
        me.tools.rzhAlt('error', '', SettingsService.I18NINFO.swat.e149);
      } else {
        let data = new Array();
        me.weekList.forEach(ele => {                     // 转化数据为Week课时并存入数组
          data.push(new Week(this.teacherCode, startTime, endTime, ele));
        });
        this.assis.addWordTime(data, res => {
          this.teacherDetail = this.assis.getTutorMore(this.teacherCode);         // 初始化老师详细信息
          this.teacherDetailNew = this.assis.getTutorMore(this.teacherCode);      // 同上
        });
      }
    } else {
      if(formData.form.controls.endTime.invalid||formData.form.controls.startTime.invalid){
        me.tools.rzhAlt('error', '', SettingsService.I18NINFO.swat.e150);
      }else{
        let startTime = formData.value.startTime, endTime = formData.value.endTime;
        if (endTime <= startTime) {
          me.tools.rzhAlt('error', '', SettingsService.I18NINFO.swat.e149);
        }else{
          me.tools.rzhAlt('error', '', SettingsService.I18NINFO.swat.e151);
        }
      }
    }
  };

  /**
   * 删除教师工作时间
   * @param workTimeCode       工作时间编码
   */
  delWorkTime(workTimeCode: string) {
    this.assis.delWorkTime(workTimeCode, res => {
      this.teacherDetail = this.assis.getTutorMore(this.teacherCode);         // 初始化老师详细信息
      this.teacherDetailNew = this.assis.getTutorMore(this.teacherCode);      // 同上
    })
  }
}
