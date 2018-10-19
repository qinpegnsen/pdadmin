import {AfterViewInit, Component, OnInit} from '@angular/core';
import {MsgorderService} from "../msgorder.service";
import {Page} from "../../../core/page/page";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {PageEvent} from "angular2-datatable";
import {isNullOrUndefined} from "util";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-msgorder',
  templateUrl: './msgorder.component.html',
  styleUrls: ['./msgorder.component.scss']
})
export class MsgorderComponent implements OnInit {
  private data: Page = new Page(); //订单信息
  orderStateNum: number = 1012; //订单状态编码
  private activePage: number = 1; //当前页
  private pageSize: number = 25; //每页条数
  private orderStateList: Array<any> = new Array(); //订单状态列表
  private sel: any = {}; //查询参数

  constructor(private msOrder: MsgorderService, private tools: RzhtoolsService, private router: Router,private routeInfo: ActivatedRoute) {
  }

  ngOnInit() {
    const _this = this;
    let activePage = _this.routeInfo.snapshot.queryParams['activePage']; //路由中获取上页列表所处的页码
    let sel = _this.routeInfo.snapshot.queryParams['sel']; //路由中获取上页列表的查询信息
    let state = _this.routeInfo.snapshot.queryParams['state']; //订单状态
    if(!isNullOrUndefined(state)) _this.sel.state = state;
    if(!isNullOrUndefined(activePage)) _this.activePage = activePage;
    if(!isNullOrUndefined(sel)) _this.sel = JSON.parse(sel);
    _this.orderStateList = _this.tools.getEnumDataList(_this.orderStateNum); //查询订单状态列表
    _this.data = new Page(_this.msOrder.queryOrders(_this.activePage, _this.pageSize, _this.sel)); //初始化查询订单列表
  }

  /**
   * 查询菜单列表
   **/
  public queryDatas(event?: PageEvent) {
    let me = this;
    if (!isNullOrUndefined(event)) {
      me.activePage = event.activePage; //设置分页
      sessionStorage.setItem('msgOrderCurPage',String(event.activePage));
    }
    let listInfos = this.msOrder.queryOrders(Number(sessionStorage.getItem('msgOrderCurPage'))||me.activePage, me.pageSize, me.sel); //查询信息结果
    me.data = new Page(listInfos); //封装信息显示
  }

  /**
   * 搜索
   * @param code
   */
  toSearch(code?: string) {
    const _this = this;
    _this.activePage = 1; //搜索时，返回第一页
    if (code == "all") _this.sel = {}; //重置搜索条件
    _this.data = new Page(_this.msOrder.queryOrders(_this.activePage, _this.pageSize, _this.sel)); //查询订单列表
  }

  /**
   * 进入详情页面
   * @param code
   */
  toDetails(code) {
    let _this = this;
    _this.router.navigate(["/main/msgorder/details"], {queryParams: {code: code,activePage:_this.activePage,sel:JSON.stringify(_this.sel)}});
  }
}
