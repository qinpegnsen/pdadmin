import {Component, OnInit} from "@angular/core";
import {GoodsComponent} from "../goods/goods.component";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PatternService} from "../../../core/forms/pattern.service";
import {ActivatedRoute, Router} from "@angular/router";
import {isNullOrUndefined} from "util";
import {GoodsService} from "../goods.service";
declare var $: any;

@Component({
  selector: 'app-goodsadd',
  templateUrl: './goodsadd.component.html',
  styleUrls: ['./goodsadd.component.scss']
})
export class GoodsaddComponent implements OnInit {
  valForm: FormGroup; // 表单信息
  goodsPromotionTypeDatas: Array<any>; //促销类型信息
  goodsStateDatas: Array<any>; //状态信息
  courseHourTypeDatas: Array<any>; //课时类型
  timeZones: Array<any>; //时区
  promotionTypeName: any;//促销名字
  private typeCode: string; //类型编码
  private typeName: string; //类型名
  private goodsCode: string; //商品编码
  private contents: string; //编辑框内容
  private datas: any = {}; //课时商品信息

  constructor(private routeInfo: ActivatedRoute, private goods: GoodsService, private parentComp: GoodsComponent, private tools: RzhtoolsService, private pattern: PatternService, private router: Router, fb: FormBuilder) {
    /**
     * 制定课表表单验证
     * @type {FormGroup}
     */
    this.valForm = fb.group({
      'goodsName': [null, Validators.compose([Validators.required])], //商品名称
      'goodsPrice': [null, Validators.compose([Validators.required, Validators.pattern(this.pattern.num)])], //商品价格
      // 'promotionPrice': [null, Validators.compose([Validators.required, Validators.pattern(this.pattern.num)])], //商品促销价格
      'promotionPrice': fb.array([
        ['']
      ]),  //商品促销价格
      'courseHour': [null, Validators.compose([Validators.required, Validators.pattern(this.pattern.pnum)])], //课时数
      'promotionType': [null, Validators.required], //促销类型：正常 Common，团购 Group，限时折扣 Discount
      'courseHourType': [null, Validators.required], //课时类型
      'validityPeriodStartTimeString': [null, Validators.required], //商品有效期开始时间
      // 'validityPeriodEndTimeString': [null, Validators.required], //商品有效期结束时间
      'timeZone': [null, Validators.required], //时区
      'validityPeriod': [null, Validators.compose([Validators.required, Validators.pattern(this.pattern.pnum)])], //课时有效期，单位月 数值数字，比如3个月，12个月等
      'state': [null, Validators.required], //商品状态：下架 Off，正常 Common，禁售 Forbid
      'couponCode': fb.array([
        ['']
      ]), //商品的优惠券  如果 商品的类型是折扣代码这是必填的
      'detailLink': ['', Validators.required] //商品详情的咨询链接
    });
  }

  ngOnInit() {
    let me = this;
    me.goodsPromotionTypeDatas = me.tools.getEnumDataList(this.parentComp.goodsPromotionType); //促销类型信息
    me.goodsStateDatas = me.tools.getEnumDataList(this.parentComp.goodsState); //状态信息
    me.courseHourTypeDatas = me.tools.getEnumDataList(this.parentComp.courseHourTypeNum); //课时类型信息
    me.timeZones = me.tools.getTimeZones(); //时区
    //获取路由的参数
    me.typeCode = me.routeInfo.snapshot.queryParams['typeCode']; //获取类型code
    me.typeName = me.routeInfo.snapshot.queryParams['typeName']; //获取类型名
    me.goodsCode = me.routeInfo.snapshot.queryParams['goodsCode']; //获取商品编码

    //富文本编辑框初始化
    $('#summernote').summernote({
      height: 230,
      dialogsInBody: true,
      callbacks: {
        onChange: (contents, $editable) => {
          me.contents = contents;
        }
      }
    });

    // 如果goodsCode不为空，则为修改操作，获取目标信息
    if (!isNullOrUndefined(me.goodsCode) && me.goodsCode) {
      let goods = me.goods.loadGoods(me.goodsCode); //获取课时商品信息
      if (!isNullOrUndefined(goods)) {
        me.datas = goods; //设置数据源
        if(me.datas.couponCode){
          let couponCodes = JSON.parse(me.datas.couponCode);
          this.promotionTypeName = goods.promotionType;
          let promotionPrices = JSON.parse(me.datas.promotionPrice);
          let couponCodesArr = this.valForm.get('couponCode') as FormArray;
          let promotionPricesArr = this.valForm.get('promotionPrice') as FormArray;
          if(!isNullOrUndefined(couponCodes)&&couponCodes.length>0){
            for (let i = 0; i < couponCodes.length; i++) {
              couponCodesArr.push(new FormControl(couponCodes[i]));
              promotionPricesArr.push(new FormControl(promotionPrices[i]));
            }
            couponCodesArr.removeAt(0);
            promotionPricesArr.removeAt(0);
          }
        }
        me.datas.validityPeriodStartTime = me.tools.dataFormat(new Date(me.datas.validityPeriodStartTime), "yyyy-MM-dd");
        me.datas.validityPeriodEndTime = me.tools.dataFormat(new Date(me.datas.validityPeriodEndTime), "yyyy-MM-dd");
        $('#summernote').summernote('code', me.datas.ad); //文本编辑器赋值
        me.contents = me.datas.ad;
      }
    }


    /**
     * 促销类型的变化
     */
    this.valForm.get('promotionType').valueChanges
      .subscribe(value => this.checkPromotionTypeValue(value));
  }

  /**
   * 根据促销类型的变化改变是否必填
   * @param value
   */
  checkPromotionTypeValue(value){
    const promotionPrice = this.valForm.get('promotionPrice');
    const couponCode = this.valForm.get('couponCode');
    if(value != "Common"){
      promotionPrice.setValidators([this.isWriteValidator]);
      couponCode.setValidators([this.isWriteValidator]);
    }else{
      promotionPrice.clearValidators();
      couponCode.clearValidators();
    }
    promotionPrice.updateValueAndValidity();
    couponCode.updateValueAndValidity();
  }

  /**
   * 重置表单数据
   */
  resetInput() {
    if (!isNullOrUndefined(this.datas.couponCode)) {
      let couponCodes = JSON.parse(this.datas.couponCode);
      let promotionPrices = JSON.parse(this.datas.promotionPrice);
      let couponCodesArr = this.valForm.get('couponCode') as FormArray;
      let promotionPricesArr = this.valForm.get('promotionPrice') as FormArray;
      if (couponCodes.length > 0) {
        for (let i = 0; i < couponCodes.length; i++) {
          if (i != 0) {
            couponCodesArr.removeAt(i);
            promotionPricesArr.removeAt(i);
            couponCodesArr.reset();
            promotionPricesArr.reset();
          }
        }
      }
    }
  }

  /**
   * 提交数据信息
   * @param $ev
   * @param value
   */
  submitForm($ev, value: any) {
    let _this = this;
    // console.log("█ this.datas.couponCode ►►►",  this.datas.couponCode);
    // if(Number(_this.datas.goodsPrice)<Number(_this.datas.promotionPrice)){
    //   _this.tools.rzhAlt('info', SettingsService.I18NINFO.swat.e152);
    //   return
    // }
    // if(_this.datas.promotionType=='Coupon'&&!this.datas.couponCode){
    //   _this.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e153);
    // }
    $ev.preventDefault();
    for (let c in _this.valForm.controls) _this.valForm.controls[c].markAsTouched();
    // if (isNullOrUndefined(_this.contents)) { //判断广告词是否填写
    //   AppComponent.rzhMsg("error", SettingsService.I18NINFO.goods.addContent);
    //   return;
    // }
    if (_this.valForm.valid) {
      value.goodsCategoryCode = _this.typeCode; //设置类型code
      value.ad = _this.contents; //设置广告词
      let isOk: boolean = false, endDate: Date; //添加或修改返回状态
      endDate = _this.tools.getAroundDateByDate(new Date(value.validityPeriodStartTimeString), value.validityPeriod);
      value.validityPeriodEndTimeString = _this.tools.dataFormat(endDate, "yyyy-MM-dd"); //设置结束日期
      value.couponCode = JSON.stringify(value.couponCode); //序列化优惠码
      value.promotionPrice = JSON.stringify(value.promotionPrice); //序列化促销价
      if (!isNullOrUndefined(_this.goodsCode) && _this.goodsCode != "") {
        value.goodsCode = _this.goodsCode; //设置code
        isOk = _this.goods.updateGoods(value); //修改数据
      } else {
        isOk = _this.goods.addGoods(value); //添加数据
      }
      if (isOk) {
        _this.cancel();//返回列表页
        _this.parentComp.queryDatas();
      }
    }
  }

  /**
   * 取消添加，返回列表页面
   */
  cancel() {
    this.router.navigate(['/main/classGoods']);
  }

  /**
   * 增加优惠券
   */
  addProCode() {
    let couponCodes = this.valForm.get('couponCode') as FormArray;
    let promotionPrices = this.valForm.get('promotionPrice') as FormArray;
    couponCodes.push(new FormControl());
    promotionPrices.push(new FormControl());
  }

  /**
   * 删除 优惠券
   */
  delProCode(i) {
    let couponCodes = this.valForm.get('couponCode') as FormArray;
    let promotionPrices = this.valForm.get('promotionPrice') as FormArray;
    if (couponCodes.length > 1) {
      couponCodes.removeAt(i);
      promotionPrices.removeAt(i);
    }
  }

  /**
   * 优惠码是否填写和促销价的校验器
   */
  isWriteValidator(info) {
    let vaild = true;
    info.controls.forEach(control => {
      if (!control.value) {
        vaild = false;
      }
    });
    if (vaild) {
      return null;
    } else {
      return {required: true}
    }
  }

}
