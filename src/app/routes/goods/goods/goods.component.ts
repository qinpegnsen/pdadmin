import {Component, OnInit, Output, ElementRef} from "@angular/core";
import {Page} from "../../../core/page/page";
import {GoodsService} from "../goods.service";
import {isNullOrUndefined} from "util";
import {PageEvent} from "angular2-datatable";
import {ActivatedRoute, Router} from "@angular/router";
import {AppComponent} from "../../../app.component";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {SettingsService} from "../../../core/settings/settings.service";
const swal = require('sweetalert');
declare var $: any;

@Component({
  selector: 'app-goods',
  templateUrl: './goods.component.html',
  styleUrls: ['./goods.component.scss']
})
export class GoodsComponent implements OnInit {
  private addOpen = false; //开启或关闭右侧类型管理中心
  @Output() goodsTypeDatas: Array<any>; //课时类型数据
  private data: Page = new Page(); //商品信息
  goodsPromotionType: number = 1011; //促销类型编码
  goodsState: number = 1009; //商品状态
  courseHourTypeNum: number = 1002; //课时类型
  private goodsCategoryCode: string; //类型编码
  private goodsCategoryName: string; //类型名

  customTemplateStringOptions0 = { //树结构参数
    isExpandedField: 'expanded',
    idField: 'uuid',
    allowDrag: true
  };

  constructor(private goods: GoodsService, private router: Router, private ElementRef: ElementRef, private route: ActivatedRoute, private tools: RzhtoolsService) {
  }

  ngOnInit() {
    let _this = this, infos = _this.goods.queryGoods(1, 25);
    //初始化装载页面
    if (isNullOrUndefined(infos)) _this.data = new Page();
    else _this.data = new Page(infos.data);
  }

  /**
   * 对支付链接进行复制
   */
  copy(content) {
    // let copyHttp = this.ElementRef.nativeElement.querySelector('#invite_code');
    var range = document.createRange();
    range.selectNode(content);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    if (document.execCommand('copy')) {
      AppComponent.rzhMsg('success', SettingsService.I18NINFO.swat.e148)
    }
    ;

    // layer.msg('复制成功')
  }

  /**
   * 查询菜单列表
   **/
  public queryDatas(event?: PageEvent) {
    let me = this, activePage = 1;
    if (!isNullOrUndefined(event)) activePage = event.activePage; //设置分页
    let listInfos = this.goods.queryGoods(activePage, 25, me.goodsCategoryCode); //查询信息结果
    me.data = new Page(listInfos.data); //封装信息显示
  }

  /**
   * 点击状态列表查询信息
   * @param msg
   */
  onEvent(msg) {
    let _this = this;
    if (!isNullOrUndefined(msg)) _this.goodsCategoryCode = msg.goodsCategoryCode, _this.goodsCategoryName = msg.categoryName; //获取类型编码及名称
    _this.data = new Page(this.goods.queryGoods(1, 25, _this.goodsCategoryCode).data); //查询信息
  }

  /**
   * 开启或关闭右侧类型管理中心
   * @constructor
   */
  OpenOrClose() {
    let me = this;
    me.addOpen = !me.addOpen;
  }

  /**
   * 获取子组件（课时类型）的数据
   * @param val
   */
  getChirldNodes(val) {
    let me = this;
    setTimeout(() => {
      me.goodsTypeDatas = val;
    }, 1);
  }

  /**
   * 前往添加商品信息
   */
  toAdd() {
    let _this = this;
    if (isNullOrUndefined(_this.goodsCategoryCode)) AppComponent.rzhMsg("error", SettingsService.I18NINFO.swat.e132);
    else _this.router.navigate(['addOrUpdate'], {
      relativeTo: _this.route,
      queryParams: {typeCode: _this.goodsCategoryCode, typeName: _this.goodsCategoryName, goodsCode: ""}
    });
  }

  /**
   * 前往修改商品信息
   */
  updateGoods(data: any) {
    let _this = this;
    _this.router.navigate(['addOrUpdate'], {
      relativeTo: _this.route,
      queryParams: {typeCode: data.goodsCategoryCode, typeName: _this.goodsCategoryName, goodsCode: data.goodsCode}
    });

  }

  /**
   * 前往上传商品图片
   * @param goodsCode
   */
  goUpload(goodsCode) {
    let _this = this;
    _this.router.navigate(['upload'], {relativeTo: _this.route, queryParams: {goodsCode: goodsCode}});
  }

  /**
   * 查看大图
   * @param img
   */
  bigImg(img) {
    this.tools.bigImg(img);
  }
}
