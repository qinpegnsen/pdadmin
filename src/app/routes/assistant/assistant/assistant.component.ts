import { Component, OnInit } from '@angular/core';
import {AssistantService} from '../assistant.service';
import {Router} from '@angular/router';
import {SettingsService} from "../../../core/settings/settings.service";

@Component({
  selector: 'app-assistant',
  templateUrl: './assistant.component.html',
  styleUrls: ['./assistant.component.scss']
})
export class AssistantComponent implements OnInit {

  private assistantData: any;                // 助教数据
  private addOpen = false;              // 右侧开关控制

  constructor(private assis: AssistantService, private router: Router, public settings: SettingsService) {}

  ngOnInit() {
    this.getAssistant();              // 初始化助教数据
  };

  /**
   * 获取助教数据
   */
  getAssistant() {
    let num:number=Number(sessionStorage.getItem('assisCurPage'))||1;
    this.assistantData = this.assis.getAssistant('1', String(num*15));
  };

  /**
   * 更新助教数据
   */
  updateAssistant() {
    const curPage = this.assistantData.curPage || 1;     // 获取当前页码。
    let result: Array<any> = new Array();
    for (let i = 1; i <= curPage; i++) {                  // 更新当前页码前所有数据
      let data = this.assis.getAssistant(i + '', this.assistantData.pageSize);
      result = result.concat(data.voList);                // 合并所有数据
    };
    this.assistantData = this.assis.getAssistant(curPage + '', this.assistantData.pageSize);
    this.assistantData.voList = result;
  };

  /**
   * 加载更多助教数据
   */
  loadMore() {
    if(!this.assistantData.lastPage) {
      const curPage = ++this.assistantData.curPage;
      sessionStorage.setItem('assisCurPage',String(curPage));
      const data = this.assis.getAssistant(curPage + '', this.assistantData.pageSize);
      data.voList = this.assistantData.voList.concat(data.voList);
      this.assistantData = data;
    };
  };

  /**
   * 开启或关闭右侧
   * @constructor
   */
  OpenOrClose() {
    this.addOpen = !this.addOpen;
  };

  /**
   * 跳转到详情
   * @param assistantCode          要跳转的助教编码
   */
  goDetail(assistantCode) {
    this.router.navigate(['/main/assis/assis/detail', assistantCode]);
  };

  /**
   * 跳转到绑定教师
   * @param assistantCode          要跳转的助教编码
   */
  bandTeacher(assistantCode) {
    this.router.navigate(['/main/assis/assis/bandTeacher', assistantCode]);
  };

}
