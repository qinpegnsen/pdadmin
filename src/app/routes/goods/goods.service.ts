import {Injectable} from '@angular/core';
import {isNullOrUndefined} from "util";
import {AjaxService} from "../../core/services/ajax.service";
import {RzhtoolsService} from "../../core/services/rzhtools.service";
import {SettingsService} from "../../core/settings/settings.service";

@Injectable()
export class GoodsService {

  constructor(private rzhAjax: AjaxService, private tools: RzhtoolsService) {
  }

  /**
   * 添加课时分类信息
   * @param categoryName 分类名
   * @param summary 分类说明
   * @param superCode 分类说明
   * @returns {Boolean}
   */
  addGoodsType(categoryName, summary, superCode?) {
    let me = this, isTrue: Boolean = false;
    if (isNullOrUndefined(superCode)) superCode = null;
    me.rzhAjax.post({
      url: '/goods/addgoodscat',
      data: {
        categoryName: categoryName,
        superCode: superCode,
        summary: summary
      },
      async: false,
      success: function (res) {
        if (res.success) me.tools.rzhAlt('success', SettingsService.I18NINFO.swat.e127), isTrue = true;
        else me.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e146, res.info);
      },
      error: function () {
        me.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e102, SettingsService.I18NINFO.swat.e145);
      }
    })
    return isTrue;
  }

  /**
   * 修改课时分类信息
   * @param data 对象信息
   * @returns {Boolean}
   */
  updateGoodsType(data) {
    let me = this, isTrue: Boolean = false;
    if (isNullOrUndefined(data)) {
      me.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e102, SettingsService.I18NINFO.goods.noUpdateInfo);
      return;
    }
    me.rzhAjax.put({
      url: '/goods/modifygoodscat',
      data: {
        goodsCategoryCode: data.goodsCategoryCode,
        categoryName: data.categoryName,
        summary: data.summary
      },
      async: false,
      success: function (res) {
        if (res.success) me.tools.rzhAlt('success', SettingsService.I18NINFO.swat.e124), isTrue = true;
        else me.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e102, res.info);
      },
      error: function () {
        me.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e102, SettingsService.I18NINFO.swat.e125);
      }
    })
    return isTrue;
  }

  /**
   * 查询课时分类列表
   * @returns {Array<any>}
   */
  queryGoodsCats() {
    let me = this, list: Array<any>;
    me.rzhAjax.get({
      url: "/goods/goodscats",
      data: {
        curPage: "1",
        pageSize: "999"
      },
      async: false,
      success: function (res) {
        if (res.success) {
          list = res.data.voList; //取出信息
        } else me.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e102, res.info);
      },
      error: function () {
        me.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e102, SettingsService.I18NINFO.swat.e134);
      }
    });
    return list;

  }

  /**
   * 查询课时分类列表
   * @returns {Array<any>}
   */
  queryGoods(activePage, pageSize, goodsCategoryCode?) {
    let me = this, infos = null;
    me.rzhAjax.get({
      url: "/goods/goods",
      data: {
        goodsCategoryCode: goodsCategoryCode,
        curPage: activePage,
        pageSize: pageSize
      },
      async: false,
      success: (data) => {
        infos = data;
      },
      error: (data) => {
        console.log('data', data);
      }
    });
    return infos;
  }

  /**
   * 加载一个课时商品详情
   * @param goodsCode 商品编码
   * @returns {null}
   */
  loadGoods(goodsCode) {
    let me = this, infos = null;
    me.rzhAjax.get({
      url: "/goods/loadgoodsdetail",
      data: {
        goodsCode: goodsCode
      },
      async: false,
      success: (res) => {
        if (res.success) infos = res.data;
      },
      error: (res) => {
        me.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e102, SettingsService.I18NINFO.swat.e134);
      }
    });
    return infos;
  }

  /**
   * 添加课时商品信息
   * @param value 参数信息
   * @returns {Boolean}
   */
  addGoods(value: any) {
    let me = this, isTrue: boolean = false;
    me.rzhAjax.post({
      url: '/goods/addgoods',
      data: value,
      async: false,
      success: function (res) {
        if (res.success) me.tools.rzhAlt('success',SettingsService.I18NINFO.swat.e127), isTrue = true;
        else me.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e102, res.info);
      },
      error: function () {
        me.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e102, SettingsService.I18NINFO.swat.e128);
      }
    })
    return isTrue;
  }

  /**
   * 修改课时商品信息
   * @param value 参数信息
   * @returns {Boolean}
   */
  updateGoods(value: any) {
    let me = this, isTrue: boolean = false;
    me.rzhAjax.put({
      url: '/goods/modifygoods',
      data: value,
      async: false,
      success: function (res) {
        if (res.success) me.tools.rzhAlt('success', SettingsService.I18NINFO.swat.e124), isTrue = true;
        else me.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e102, res.info);
      },
      error: function () {
        me.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e102, SettingsService.I18NINFO.swat.e125);
      }
    });
    return isTrue;
  }

  /**
   * 设置课时商品图片
   * @param goodsCode 商品编码
   * @param uid 图片标示
   * @returns {boolean}
   */
  setGoodspic(goodsCode: string, uid: string) {
    let me = this, isTrue: boolean = false;
    me.rzhAjax.put({
      url: '/goods/goodspic',
      data: {goodsCode: goodsCode, uid: uid},
      async: false,
      success: function (res) {
        if (res.success) me.tools.rzhAlt('success', SettingsService.I18NINFO.swat.e137), isTrue = true;
        else me.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e102, res.info);
      },
      error: function () {
        me.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e102, SettingsService.I18NINFO.swat.e138);
      }
    });
    return isTrue;
  }
}
