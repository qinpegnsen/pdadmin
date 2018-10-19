import {Component, OnInit} from '@angular/core';
import {MsgTemplateService} from "../msg-template.service";
import {Page} from "../../../core/page/page";
import {ActivatedRoute, Router} from "@angular/router";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'app-msg-template',
  templateUrl: './msg-template.component.html',
  styleUrls: ['./msg-template.component.scss']
})
export class MsgTemplateComponent implements OnInit {
  public data: Page = new Page(); //订单信息

  constructor(public msgTemp: MsgTemplateService, public router: Router, public route: ActivatedRoute) {
  }

  ngOnInit() {
    let _this = this;
    _this.notifyList();
  }

  /**
   * 获取消息通知列表
   */
  notifyList() {
    let _this = this, list: Array<any>;
    _this.data = _this.msgTemp.notifyList(); //获取消息通知列表
  }

  /**
   * 添加或修改消息通知
   */
  toAddOrEdit(code?: string) {
    let _this = this;
    if (isNullOrUndefined(code)) _this.router.navigate(["addOrEdit"], {relativeTo: _this.route});
    else _this.router.navigate(["addOrEdit"], {relativeTo: _this.route, queryParams: {code: code}});
  }
}
