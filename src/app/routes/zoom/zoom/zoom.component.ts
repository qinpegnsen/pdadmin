import { Component, OnInit, ViewChild } from '@angular/core';
import {ZoomService} from "../zoom.service";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {SettingsService} from "../../../core/settings/settings.service";

@Component({
  selector: 'app-zoom',
  templateUrl: './zoom.component.html',
  styleUrls: ['./zoom.component.scss']
})
export class ZoomComponent implements OnInit {
  private zoomList: Array<any> = new Array();
  @ViewChild('zoomForm') zoomForm;           // 添加zoom表单对象

  constructor(public zoom: ZoomService, public tools: RzhtoolsService) { }

  ngOnInit() {
    this.zoomList = this.zoom.getZoomList();
  }

  addZoom(form) {
    let me = this;
    if(form.valid){
      me.zoom.addZoom(form.value, res => {
        me.tools.rzhAlt('success', SettingsService.I18NINFO.zoom.addSuccess);
        me.zoomList = me.zoom.getZoomList();
        me.zoomForm.reset();
      })
    }
  }

  /**
   * 设置zoom参数
   * @param data                      被设置的zoom参数数据
   */
  set(data) {
    data.clone = {          // 克隆zoom参数防止双向绑定冲突原数据
      hostId: data.hostId,
      apiKey: data.apiKey,
      apiSecret: data.apiSecret,
      zoomLogin: data.zoomLogin,
      zoomLoginPassword: data.zoomLoginPassword,
      state: data.state,
    };
    data.set = true;
  };

  /**
   * 关闭系统参数设置
   * @param data
   */
  noSet(data) {
    data.set = false;
  };

  /**
   * 修改系统参数
   * @param data                //被修改的系统参数数据
   */
  modifyZoom(data) {
    let me = this;
    let zoomData = Object.assign({}, data.clone);
    zoomData.zoomCode = data.zoomCode
    me.zoom.addZoom(zoomData, res => {
      me.tools.rzhAlt('success', SettingsService.I18NINFO.zoom.modifySuccess);
      me.zoomList = me.zoom.getZoomList();
    })
  };

  /**
   * 删除zoom资源
   * @param code    zoomcode
   */
  delZoom(code) {
    let me = this;
    me.zoom.delete(code, res => {
      me.tools.rzhAlt('success', SettingsService.I18NINFO.zoom.delSuccess);
      me.zoomList = me.zoom.getZoomList();
    })
  }

}
