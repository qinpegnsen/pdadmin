import {Component, OnInit} from '@angular/core';
import {FileUploader} from "ng2-file-upload";
import {ActivatedRoute, Router} from "@angular/router";
import {AppComponent} from "../../../app.component";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {GoodsService} from "../goods.service";
import {isNullOrUndefined} from "util";
import {GoodsComponent} from "../goods/goods.component";
import {MaskService} from "../../../core/services/mask.service";
import {SettingsService} from "../../../core/settings/settings.service";
const uploadUrl = "/upload/goods/goodsimg";  //图片上传路径(调取上传的接口)
@Component({
  selector: 'app-goodsupload',
  templateUrl: './goodsupload.component.html',
  styleUrls: ['./goodsupload.component.scss']
})
export class GoodsuploadComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({
    url: uploadUrl,
    itemAlias: "file",
    queueLimit: 1
  }); //初始化上传方法
  private uid: string; //上传编码
  private goodsCode; //课时商品编码

  constructor(private router: Router, private tools: RzhtoolsService, private goods: GoodsService, private routeInfo: ActivatedRoute,private parentComp: GoodsComponent,private mask:MaskService) {
  }

  ngOnInit() {
    let me = this;
    me.goodsCode = me.routeInfo.snapshot.queryParams['goodsCode']; //获取类型code
    if (isNullOrUndefined(me.goodsCode)) me.cancel(); //如果没有商品标示，则自动返回信息列表页面
  }

  /**
   * 点击取消，进入列表页面
   */
  cancel() {
    this.router.navigate(['/main/classGoods']);
  }

  /**
   * 上传图片信息
   */
  toUpload() {
    let _this = this;

    /**
     * 上传前，构建form时，传入自定义参数
     * @param item
     */
    _this.uploader.onBuildItemForm = function (fileItem, form) {
      _this.mask.showMask(); //锁屏
      _this.uid = _this.tools.uploadUid();
      form.append('uid', _this.uid);
    }

    /**
     * 执行上传
     */
    _this.uploader.uploadAll();

    /**
     * 上传成功处理
     * @param item 成功的文件列表
     * @param response 返回信息
     * @param status 状态码
     * @param headers 上传成功后服务器的返回的返回头
     */
    _this.uploader.onSuccessItem = function (item, response, status, headers) {
      _this.mask.hideMask(); //解除锁屏
      let res = JSON.parse(response);
      if (res.success) {
        let isTrue = _this.goods.setGoodspic(_this.goodsCode,_this.uid); //更新图片信息
        if(isTrue){
          _this.cancel();//返回列表页
          _this.parentComp.queryDatas(); //更新列表信息
        }
      } else {
        AppComponent.rzhMsg("error", SettingsService.I18NINFO.swat.e136);
      }
    }

    /**
     * 上传失败处理
     * @param item 失败的文件列表
     * @param response 返回信息
     * @param status 状态码
     * @param headers 上传失败后服务器的返回的返回头
     */
    _this.uploader.onErrorItem = function (item, response, status, headers) {
      _this.mask.hideMask(); //解除锁屏
      AppComponent.rzhMsg("error", SettingsService.I18NINFO.swat.e136);
    }

  }

}
