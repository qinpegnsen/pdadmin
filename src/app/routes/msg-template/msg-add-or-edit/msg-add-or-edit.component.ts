import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {isNullOrUndefined} from "util";
import {MsgTemplateService} from "../msg-template.service";
import {AppComponent} from "../../../app.component";
import {SettingsService} from "../../../core/settings/settings.service";
import {MsgTemplateComponent} from "../msg-template/msg-template.component";
declare var $: any;

@Component({
  selector: 'app-msg-add-or-edit',
  templateUrl: './msg-add-or-edit.component.html',
  styleUrls: ['./msg-add-or-edit.component.scss']
})

export class MsgAddOrEditComponent implements OnInit {
  content: string; //文本编辑器内容
  notify: any = {}; //一条消息记录
  code: string; //传入的编码

  constructor(private router: Router, private routeInfo: ActivatedRoute, private msgService: MsgTemplateService, private setting: SettingsService, private msgComponent: MsgTemplateComponent) {
  }

  ngOnInit() {
    let _this = this;
    _this.code = _this.routeInfo.snapshot.queryParams['code']; //获取消息码
    if (!isNullOrUndefined(_this.code) && _this.code != "") {
      _this.loadNotify(_this.code); //获取一条消息信息
      setTimeout(() => {
        _this.content = _this.notify.content;
        $('#summernote').summernote('code', _this.content); //文本编辑器赋值
      }, 0)
    }
    //富文本编辑框初始化
    $('#summernote').summernote({
      height: 230,
      dialogsInBody: true,
      callbacks: {
        onChange: (content, $editable) => {
          _this.content = content;
        }
      }
    });
  }

  /**
   * 返回列表页面
   */
  toBack() {
    this.router.navigate(["/main/msgTemplate"]);
  }

  /**
   * 提交信息
   * @param val
   */
  onSubmit(val: any) {
    let _this = this, ret: any, data: any = val.value, user = _this.setting.user;
    if (isNullOrUndefined(_this.content) || _this.content == "") {
      AppComponent.rzhMsg("info", SettingsService.I18NINFO.msg.msgInfoErr);
      return;
    }
    data.content = _this.content; //设置模板内容
    data.optCode = user.assistantCode; //操作人code
    data.optName = user.name; //操作人姓名

    if(isNullOrUndefined(_this.code)){
      ret = _this.msgService.createNotify(data); //添加消息模板
    }else{
      data.notifyCode = _this.code;
      ret = _this.msgService.editNotify(data); //修改消息模板
    }
    if (ret.success) {
      _this.toBack(); //回列表页
      _this.msgComponent.notifyList();
      AppComponent.rzhMsg("success", SettingsService.I18NINFO.swat.e101);
    } else {
      AppComponent.rzhMsg("error", ret.info);
    }
  }

  /**
   * 加载一条消息记录
   * @param code
   */
  loadNotify(code: string) {
    let _this = this;
    _this.notify = _this.msgService.loadNotify(code);
  }
}
