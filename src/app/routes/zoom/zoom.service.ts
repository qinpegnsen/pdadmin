import { Injectable } from '@angular/core';
import {AjaxService} from "../../core/services/ajax.service";
import {SettingsService} from "../../core/settings/settings.service";
import {RzhtoolsService} from "../../core/services/rzhtools.service";

@Injectable()
export class ZoomService {

  constructor(public ajax: AjaxService, public tools: RzhtoolsService) { }

  /**
   * 获取zoom数据
   * @returns {any}      返回zoom数组
   */
  getZoomList() {
    let me = this,result;
    me.ajax.get({
      url:'/zoom/list',
      async: false,
      success: res => {
        if(res.success){
          result = res.data || []
        }else {
          me.tools.rzhAlt('error', SettingsService.I18NINFO.enterprise.addSuccess);
        }
      },
      error: res => {
        console.log(res);
      }
    });
    return result;
  };

  /**
   * 添加或修改zoom
   * @param data   添加或修改的zoom数据，有code是修改，没code是添加
   * @param callback    成功回调
   */
  addZoom(data: any, callback?: any){
    let me = this;
    me.ajax.post({
      url: '/zoom/addormodify',
      data: data,
      success: res => {
        if(res.success){
          callback && callback(res);
        }else {
          if(data.zoomCode){
            me.tools.rzhAlt('error', SettingsService.I18NINFO.zoom.addError);
          }else {
            me.tools.rzhAlt('error', SettingsService.I18NINFO.zoom.modifyError);
          }
        }
      },
      error: res => {
        console.log(res);
      }
    });
  };

  /**
   * 删除zoom资源
   * @param zoomCode     // zoomCode
   * @param callback      // 成功回调
   */
  delete(zoomCode: string, callback?: any){
    let me = this;
    me.ajax.del({
      url: '/zoom/delete',
      data: {zoomCode: zoomCode},
      success: res => {
        if(res.success) {
          callback && callback(res);
        }else {
          me.tools.rzhAlt('error', SettingsService.I18NINFO.zoom.delError);
        }
      },
      error: res => {
        console.log(res);
      }
    })
  }

}
