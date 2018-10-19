import {Injectable} from '@angular/core';
import {AjaxService} from '../../core/services/ajax.service';
import {RzhtoolsService} from "../../core/services/rzhtools.service";
import {SettingsService} from "../../core/settings/settings.service";

@Injectable()
export class SystemService {

  constructor(private ajax: AjaxService, private tools: RzhtoolsService) {
  }

  /**
   * 获取系统参数列表
   * @returns {any}                  返回系统参数列表
   */
  getSettings() {
    let result: Array<any> = new Array();
    const me = this;
    me.ajax.get({
      url: '/setting/settings',
      async: false,
      success: res => {
        res.success ? result = res.data : me.tools.rzhAlt('error', '', SettingsService.I18NINFO.swat.e141);
      },
      error: res => {
        console.log(res);
      }
    });
    return result;
  };

  /**
   * 加载一个系统参数
   * @param key                        参数键值
   * @returns {any}                    参数值
   */
  loadSetting(key) {
    let result: any = '';
    const me = this;
    me.ajax.get({
      url: '/setting/loadset',
      data: {k: key},
      async: false,
      success: res => {
        res.success ? result = res.data : me.tools.rzhAlt('error', '', SettingsService.I18NINFO.swat.e141);
      },
      error: res => {
        console.log(res);
      }
    });
    return result;
  };

  /**
   * 修改系统参数
   * @param {string} key                    参数键值
   * @param {string} val                    参数值
   * @param {string} summary                参数说明
   * @param callback                        成功回调
   */
  modifySetting(key: string, val: string, summary: string, callback?: any) {
    const me = this;
    me.ajax.post({
      url: '/setting/modifyset',
      data: {k: key, v: val, summary: summary},
      success: res => {
        res.success ? callback && callback(res) : me.tools.rzhAlt('error', '', SettingsService.I18NINFO.swat.e125);
      },
      error: res => {
        console.log(res);
      }
    });
  };

}
