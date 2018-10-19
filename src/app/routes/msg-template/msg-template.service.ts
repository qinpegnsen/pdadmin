import {Injectable} from '@angular/core';
import {AjaxService} from "../../core/services/ajax.service";
import {Page} from "../../core/page/page";
import {SettingsService} from "../../core/settings/settings.service";

@Injectable()
export class MsgTemplateService {

  constructor(public ajax: AjaxService) {
  }

  /**
   * 查询消息通知模板列表
   * @returns {Array<any>}
   */
  notifyList() {
    let _this = this, ret: Page = new Page();
    _this.ajax.get({
      url: "/notify/template/list",
      async: false,
      success: (response) => {
        if (response.success) {
          let data = response.data;
          if (data.length > 0) {
            ret.voList = data;
            ret.pageSize = 999;
            ret.curPage = 1;
            ret.lastPage = true;
            ret.totalRow = data.length;
            ret.totalPage = 1;
          }
        }
      }
    })
    return ret;
  }

  /**
   * 添加模板消息
   * @param data 数据信息
   */
  createNotify(data: any) {
    let _this = this, ret: any = {};
    _this.ajax.post({
      url: "/notify/template/create",
      data: data,
      async: false,
      success: (response) => {
        ret = response;
      },
      error: (response) => {
        ret.success = false;
        ret.info = SettingsService.I18NINFO.swat.e102;
      }
    })
    return ret;
  }

  /**
   * 加载一条信息
   * @code 模板编码
   */
  loadNotify(code:string){
    let _this = this,ret:any={};
    _this.ajax.get({
      url:"/notify/template/load",
      async:false,
      data:{notifyCode:code},
      success:(response)=>{
        if(response.success) ret = response.data;
      }
    });
    return ret;
  }

  /**
   * 修改模板消息
   * @param data 数据信息
   */
  editNotify(data: any) {
    let _this = this, ret: any = {};
    _this.ajax.post({
      url: "/notify/template/modify",
      data: data,
      async: false,
      success: (response) => {
        ret = response;
      },
      error: (response) => {
        ret.success = false;
        ret.info = SettingsService.I18NINFO.swat.e102;
      }
    })
    return ret;
  }

}
