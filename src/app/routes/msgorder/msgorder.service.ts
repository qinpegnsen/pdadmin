import {Injectable} from '@angular/core';
import {AjaxService} from "../../core/services/ajax.service";
import {AppComponent} from "../../app.component";
import {SettingsService} from "../../core/settings/settings.service";
import {isNullOrUndefined} from "util";
import {RzhtoolsService} from "../../core/services/rzhtools.service";

@Injectable()
export class MsgorderService {

  constructor(private ajax: AjaxService, private tools: RzhtoolsService) {
  }

  /**
   * 查询订单列表信息
   * @param curPage 当前页
   * @param pageSize 每页条数
   * @param datas 查询参数
   */
  queryOrders(curPage, pageSize, datas?: any) {
    let rList: any;
    const qData = {
      curPage: curPage,
      pageSize: pageSize,
      consumerCode: '',
      isAssess: '',
      state: '',
      createTimeBegin: '',
      createTimeEnd: ''
    };
    const _this = this;
    Object.assign(qData, datas); //设置查询参数
    //时区转换
    if (!isNullOrUndefined(qData.createTimeBegin) && qData.createTimeBegin != "") qData.createTimeBegin = _this.tools.dateToUTC(qData.createTimeBegin);
    if (!isNullOrUndefined(qData.createTimeEnd) && qData.createTimeEnd != "") qData.createTimeEnd = _this.tools.dateToUTC(qData.createTimeEnd);
    _this.ajax.get({
      url: '/order/orders',
      data: qData,
      mask: true,
      async: false,
      success: (res) => {
        if (res.success) rList = res.data; else AppComponent.rzhMsg("error", SettingsService.I18NINFO.swat.e134);
      },
      error: (res) => {
        AppComponent.rzhMsg("error", SettingsService.I18NINFO.swat.e134);
      }
    });
    //结果集时区转换为当前时区
    if (!isNullOrUndefined(rList) && rList != "") {
      let voList: Array<any> = rList.voList;
      if (!isNullOrUndefined(voList)) {
        voList.forEach(ret => {
          ret.createTime = _this.tools.UTCToDate(ret.createTime);
        })
      }
    }
    return rList;
  }

  /**
   * 查询订单详情
   * @param orderNo 订单编码
   * @returns {any}
   */
  loadOrderDetails(orderNo) {
    let info: any;
    const _this = this;
    _this.ajax.get({
      url: '/order/load/detail',
      data: {orderNo: orderNo},
      mask: true,
      async: false,
      success: (res) => {
        if (res.success) info = res.data; else AppComponent.rzhMsg("error", SettingsService.I18NINFO.order.queryOrderErr);
      },
      error: (res) => {
        AppComponent.rzhMsg("error", SettingsService.I18NINFO.swat.e134);
      }
    });

    //处理时区时间
    if (!isNullOrUndefined(info) && info != "") {
      info.createTime = _this.tools.UTCToDate(info.createTime);
      info.updateTime = _this.tools.UTCToDate(info.updateTime);
      let orderPayments: Array<any> = info.orderPayments;
      let orderTraces: Array<any> = info.orderTraces;
      if (orderPayments) {
        orderPayments.forEach(ret => {
          ret.createTime = _this.tools.UTCToDate(ret.createTime);
          ret.payTime = _this.tools.UTCToDate(ret.payTime);
        })
      }
      if (orderTraces) {
        orderTraces.forEach(ret => {
          ret.createTime = _this.tools.UTCToDate(ret.createTime);
        })
      }
    }

    return info;
  }

}
