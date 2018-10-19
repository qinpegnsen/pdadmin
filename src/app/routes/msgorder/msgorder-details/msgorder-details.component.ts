import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from "@angular/router";
import {isNullOrUndefined} from "util";
import {AppComponent} from "../../../app.component";
import {MsgorderService} from "../msgorder.service";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {SettingsService} from "../../../core/settings/settings.service";

@Component({
  selector: 'app-msgorder-details',
  templateUrl: './msgorder-details.component.html',
  styleUrls: ['./msgorder-details.component.scss']
})
export class MsgorderDetailsComponent implements OnInit {
  private orderInfo: any;//订单信息
  private activePage: number = 1;
  private sel: any = {}; //查询参数
  private orderStateNum: number = 1012;//订单状态编码
  private goodsStateNum: number = 1009;//商品状态编码

  constructor(private routeInfo: ActivatedRoute, private orders: MsgorderService, private tools: RzhtoolsService,private location:Location,private router:Router) {
  }

  ngOnInit() {
    let _this = this;
    let orderNo = _this.routeInfo.snapshot.queryParams['code']; //路由中获取订单编码
    let activePage = _this.routeInfo.snapshot.queryParams['activePage']; //路由中获取上页列表所处的页码
    let sel = _this.routeInfo.snapshot.queryParams['sel']; //路由中获取上页列表的查询信息
    if(!isNullOrUndefined(activePage)) _this.activePage = activePage;
    if(!isNullOrUndefined(sel)) _this.sel = sel;
    if (isNullOrUndefined(orderNo)) AppComponent.rzhMsg("error", SettingsService.I18NINFO.swat.e139, SettingsService.I18NINFO.swat.e140); //异常处理
    else _this.orderInfo = _this.orders.loadOrderDetails(orderNo); //查询订单信息
  }


  /**
   * 查看大图
   * @param img
   */
  bigImg(img) {
    this.tools.bigImg(img);
  }

  /**
   * 返回上级页面
   */
  goBack(){
    let _this = this;
    _this.router.navigate(["/main/msgorder"],{queryParams: {activePage:_this.activePage,sel:_this.sel}, skipLocationChange: true});
  }
}
