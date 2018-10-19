import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {AssistantService} from '../assistant.service';
import {RzhtoolsService} from '../../../core/services/rzhtools.service';
import {NgForm} from '@angular/forms';
import {PatternService} from '../../../core/forms/pattern.service';

@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.component.html',
  styleUrls: ['./add-teacher.component.scss']
})
export class AddTeacherComponent implements OnInit {

  @Input() isOpen: boolean;                     // 父组件控制右侧容器开关
  @Output() close = new EventEmitter();         // 父组件控制右侧关闭对象
  @Output() update = new EventEmitter();        // 父组件数据更新事件对象

  private timezones: Array<any>;          // 时区列表
  private manageState: Array<any>;        // 管理状态列表
  private Gender: Array<any>;             // 性别列表
  private countryList: any;                       // 国家代码列表
  private nativeLanguageNum:number = 1026; //母语枚举代码
  private nativeLanguageList:Array<any>;

  @ViewChild('addTeacher') addTeacher;           // 添加老师表单对象

  constructor(private assis: AssistantService, private rzhtools: RzhtoolsService, private patterns: PatternService) {
  }

  ngOnInit() {
    this.timezones = this.rzhtools.getTimeZones();     // 获取时区
    this.manageState = this.rzhtools.getEnumDataList('1016');   // 获取管理状态枚举
    this.Gender = this.rzhtools.getEnumDataList('1001');       // 获取性别列表
    this.nativeLanguageList = this.rzhtools.getEnumDataList(this.nativeLanguageNum);       // 获取母语列表
    this.countryList = this.assis.getCountries();          // 获取国家代码列表
  }

  /**
   * 取消添加助教
   */
  cancelAdd() {
    this.close.emit();
  }

  /**
   * 提交添加老师数据
   * @param {NgForm} formData  *老师数据
   */
  onSubmit(formData: NgForm) {
    if (formData.valid) {
      console.log("█ formData.value ►►►",formData.value  );
      this.assis.addTutor(formData.value, res => {
          this.addTeacher.reset();
          this.update.emit();
          this.close.emit();
      });
    }
  }
}
