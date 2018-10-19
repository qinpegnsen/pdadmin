import {Component, OnInit} from '@angular/core';
import {AssistantService} from '../assistant.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PatternService} from '../../../core/forms/pattern.service';
import {RzhtoolsService} from '../../../core/services/rzhtools.service';
import {SettingsService} from "../../../core/settings/settings.service";

@Component({
  moduleId: module.id,
  selector: 'app-assistant-detail',
  templateUrl: 'assistant-detail.component.html',
  styleUrls: ['assistant-detail.component.scss']
})
export class AssistantDetailComponent implements OnInit {
  private assisCode: string;                  // 助教编码
  private AssistantDetail: any;               // 助教详细信息（非实时）
  private AssistantDetailNew: any;            // 助教详细信息（实时）
  private AssistantState: Array<any>;         // 助教状态列表
  private manageState: Array<any>;            // 管理状态列表
  private timezones: Array<any>;                     // 时区列表

  constructor(private router: Router, private assis: AssistantService, private route: ActivatedRoute, private patterns: PatternService, private tools: RzhtoolsService, public settings: SettingsService) {
  }

  ngOnInit() {
    this.assisCode = this.getassisCode();                                       // 初始化助教编码
    this.AssistantDetail = this.assis.getAssistantDetail(this.assisCode);       // 初始化助教详细信息
    this.AssistantDetailNew = this.assis.getAssistantDetail(this.assisCode);    // 同上
    this.AssistantState = this.tools.getEnumDataList('1017');                   // 获取助教状态
    this.manageState = this.tools.getEnumDataList('1016');                      // 获取管理状态
    this.timezones = this.tools.getTimeZones();                                  // 初始化时区列表
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
   * 提交助教修改信息
   * @param update        更新的助教数据
   */
  onSubmit(update) {
    if (update.valid) {
      const data = update.value;
      data.assistantCode = this.getassisCode();
      this.assis.modifyAssistant(update.value, res => {
          this.tools.rzhAlt('success', SettingsService.I18NINFO.swat.e123, SettingsService.I18NINFO.swat.e124);
          this.AssistantDetail = this.assis.getAssistantDetail(this.assisCode);
          this.AssistantDetailNew = this.assis.getAssistantDetail(this.assisCode);
      });
    }
  }

  /**
   * 返回上级页面
   */
  goBack() {
    let _this = this;
    _this.router.navigate(["/main/assis/assis/list"]);
  };
}
