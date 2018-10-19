import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {TreeNode} from "angular-tree-component";
import {isNullOrUndefined} from "util";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {EnterpriseService} from "../enterprise.service";
import {SettingsService} from "../../../core/settings/settings.service";
import {PatternService} from "../../../core/forms/pattern.service";

declare var $: any;

@Component({
  selector: 'app-edit-enterprise',
  templateUrl: './edit-enterprise.component.html',
  styleUrls: ['./edit-enterprise.component.scss']
})

export class EditEnterpriseComponent implements OnInit {
  @Input() isOpen;                       // 显示开关
  @Input() initData;                    // 添加/修改企业表单绑定数据
  @Output() closeOpen = new EventEmitter();    // 关闭显示事件
  @Output() updata = new EventEmitter();       // 更新数据事件
  @ViewChild('addEnterprise') addEnterprise;       // 添加/修改企业表单对象
  private countryList: Array<any> = new Array();    // 国家代码
  private timezones: Array<any> = new Array();      // 时区
  private sexCode = 1001;              // 性别枚举编码
  private CountryCode = 9999;              // 国家枚举编码
  private sexs: Array<any> = new Array();       // 性别列表

  constructor(private tools: RzhtoolsService, private enterprise: EnterpriseService, public settings: SettingsService, public patterns: PatternService) {
  }

  ngOnInit() {
    this.countryList = this.tools.getEnumDataList(this.CountryCode);                 // 初始化国家代码
    this.timezones = this.tools.getTimeZones();                   // 初始化时区
    this.sexs = this.tools.getEnumDataList(this.sexCode);           // 初始化性别
  }

  /**
   * 提交添加/修改企业数据
   * @param fromData      企业数据
   */
  onsubmit(fromData) {
    if (fromData.valid) {
      if (this.initData.bl) {                 // 判断为true则添加企业数据
        this.enterprise.addEnetrprise(fromData.value, (res) => {
          this.tools.rzhAlt('success', SettingsService.I18NINFO.enterprise.addSuccess);
          this.closeOpen.emit();
          this.updata.emit();
          this.addEnterprise.reset();
        })
      } else {                               // 判断为false则修改企业数据
        this.enterprise.modifyStudent(this.initData.data.studentCode, fromData.value, (res) => {
          this.tools.rzhAlt('success', SettingsService.I18NINFO.enterprise.modifySuccess);
          this.closeOpen.emit();
          this.updata.emit();
          this.addEnterprise.reset();
        }, false);
      }
      ;
    }
    ;
  };

  /**
   * 关闭添加/修改企业
   */
  closeEnterprise() {
    if (this.initData.bl) {
      this.addEnterprise.reset();
    }
    this.closeOpen.emit();
  }

}
