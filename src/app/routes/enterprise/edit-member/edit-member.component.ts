import {Component, OnInit, Output, EventEmitter, Input, ViewChild} from '@angular/core';
import {RzhtoolsService} from '../../../core/services/rzhtools.service';
import {EnterpriseService} from "../enterprise.service";
import {SettingsService} from "../../../core/settings/settings.service";
import {PatternService} from "../../../core/forms/pattern.service";

@Component({
  selector: 'app-edit-member',
  templateUrl: './edit-member.component.html',
  styleUrls: ['./edit-member.component.scss']
})
export class EditMemberComponent implements OnInit {
  @Input() isOpen;                     // 显示开关
  @Input() initData;                   // 添加/修改绑定表单数据
  @Input() selectEnterprise;           // 选中企业对象
  @Output() closeOpen = new EventEmitter();    // 关闭显示事件
  @Output() updata = new EventEmitter();       // 更新数据事件
  @ViewChild('addMember') addMember;           // 添加成员表单对象
  private countryList: Array<any> = new Array();     // 国家代码
  private timezones: Array<any> = new Array();      // 时区
  private isDisabled:boolean; //锁定按钮
  private CountryCode = 9999;              // 国家枚举编码

  constructor(private enterprise: EnterpriseService, private tools: RzhtoolsService, public patterns: PatternService) {
  }

  ngOnInit() {
    this.isDisabled = false; //不锁定按钮
    this.countryList = this.tools.getEnumDataList(this.CountryCode);              // 初始化国家代码
    this.timezones = this.tools.getTimeZones();                  // 初始化时区
  }

  /**
   * 提交添加/修改成员信息
   * @param fromData             成员信息数据
   */
  onsubmit(fromData) {
    let me = this;
    if(fromData.valid){
      me.isDisabled = true; //锁定按钮
      if(me.initData.bl){                           // 判断为true则添加数据
        let data = fromData.value;
        data.sharedStudentCode = me.selectEnterprise.studentCode;
        data.sharedStudentName = me.selectEnterprise.name;
        data.sharedStudentEmail = me.selectEnterprise.email;
        me.enterprise.addMember(data,(res) => {
          me.tools.rzhAlt('success', SettingsService.I18NINFO.enterprise.addSuccess);
          me.isDisabled = false; //解除锁定按钮
          me.closeOpen.emit();
          me.updata.emit();
          me.addMember.reset();
        });
        me.isDisabled = false; //解除锁定按钮
      }else {                                        // 判断为false则修改数据
        me.enterprise.modifyStudent(me.initData.data.studentCode, fromData.value, (res) => {
          me.tools.rzhAlt('success', SettingsService.I18NINFO.enterprise.modifySuccess);
          me.isDisabled = false; //解除锁定按钮
          me.closeOpen.emit();
          me.updata.emit();
          me.addMember.reset();
        });
      };
    };
  };

  /**
   * 关闭添加成员
   */
  closeMember() {
    this.isDisabled = false; //解除锁定按钮
    if(this.initData.bl) {
      this.addMember.reset();
    };
    this.closeOpen.emit();
  }

}
