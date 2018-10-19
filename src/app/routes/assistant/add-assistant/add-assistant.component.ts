import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {AssistantService} from '../assistant.service';
import {RzhtoolsService} from '../../../core/services/rzhtools.service';
import {NgForm} from '@angular/forms';
import {PatternService} from '../../../core/forms/pattern.service';
import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';
import {SettingsService} from "../../../core/settings/settings.service";

@Component({
  selector: 'app-add-assistant',
  templateUrl: './add-assistant.component.html',
  styleUrls: ['./add-assistant.component.scss']
})
export class AddAssistantComponent implements OnInit {

  @Input() isOpen: boolean;                       // 父组件控制右侧容器开关
  @Output() close = new EventEmitter();           // 父组件控制右侧关闭对象
  @Output() update = new EventEmitter();          // 父组件数据更新事件对象
  private timezones: Array<any>;                  // 时区列表
  private manageState: Array<any>;                // 管理状态列表
  public imgBase64: string;

  @ViewChild('addAssistant') addAssistant;                 // 添加助教表单对象

  constructor(private assis: AssistantService, private rzhtools: RzhtoolsService, private patterns: PatternService, public settings: SettingsService) {
  }

  ngOnInit() {
    this.timezones = this.rzhtools.getTimeZones();     // 获取时区
    this.manageState = this.rzhtools.getEnumDataList('1016');   // 获取管理状态枚举
  }

  /**
   * 取消添加助教
   */
  cancelAdd() {
    this.close.emit();        // 关闭右侧表单
  }

  /**
   * 提交添加助教数据
   * @param {NgForm} formData  *助教数据
   */
  onSubmit(formData: NgForm) {
    if (formData.valid) {
      this.assis.addAssistant(formData.value, res => {
          this.addAssistant.reset();                              // 添加助教表单重置
          this.update.emit();                                      // 父组件更新数据
          this.close.emit();                                      // 关闭右侧表单
          this.rzhtools.rzhAlt('success', 'success', SettingsService.I18NINFO.swat.e127);
      }, this.imgBase64);
    }
  }

  /**
   * 更改头像
   * @param data
   * @param img
   * @returns {boolean}
   */
  upload(data) {
    let file = data.files[0];
    let me = this;
    if (!/image\/\w+/.test(file.type)) {
      return false;
    }
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
      me.imgBase64 = this.result;
    }
  }

}
