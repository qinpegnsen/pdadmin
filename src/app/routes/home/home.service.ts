import {Injectable} from '@angular/core';
import {AjaxService} from "../../core/services/ajax.service";

@Injectable()
export class HomeService {

  constructor(private ajax: AjaxService) {
  }

  /**
   * 查询教师个数
   * @returns {any}
   */
  tutorNum() {
    let info: number = 0,_this = this;
    _this.ajax.get({
      url: '/statis/tutor/total',
      async: false,
      success: (res) => {
        if (res.success) info = res.data;
      }
    });
    return info;
  }

  /**
   * 查询教师个数
   * @returns {any}
   */
  orderNum() {
    let info: number = 0,_this = this;
    _this.ajax.get({
      url: '/statis/order/total',
      async: false,
      success: (res) => {
        if (res.success) info = res.data;
      }
    });
    return info;
  }

  /**
   * 查询当前预约数
   * @returns {any}
   */
  bookingNum() {
    let info: number = 0,_this = this;
    _this.ajax.get({
      url: '/statis/booking/total',
      async: false,
      success: (res) => {
        if (res.success) info = res.data;
      }
    });
    return info;
  }

  /**
   * 查询已完成的上课数
   * @returns {any}
   */
  classroomOverNum() {
    let info: number = 0,_this = this;
    _this.ajax.get({
      url: '/statis/classroom/over/total',
      async: false,
      success: (res) => {
        if (res.success) info = res.data;
      }
    });
    return info;
  }

  /**
   * 分状态统计订单数
   * @returns {any}
   */
  orderStateTotal() {
    let info: Array<any> = new Array(),_this = this;
    _this.ajax.get({
      url: '/statis/order/state/total',
      async: false,
      success: (res) => {
        if (res.success) info = res.data;
      }
    });
    return info;
  }

  /**
   * 统计近六个月的上课数
   * @returns {any}
   */
  classroomTotalFor6Month() {
    let info: Array<any> = new Array(),_this = this;
    _this.ajax.get({
      url: '/statis/classroom/coursetime/total',
      async: false,
      success: (res) => {
        if (res.success) info = res.data;
      }
    });
    return info;
  }

  /**
   * 用户申请退款数
   * @returns {any}
   */
  orderRefundingNum() {
    let info: number = 0,_this = this;
    _this.ajax.get({
      url: '/statis/order/refunding/total',
      async: false,
      success: (res) => {
        if (res.success) info = res.data;
      }
    });
    return info;
  }


}
