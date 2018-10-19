import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from "@angular/core";
import {TreeNode} from "angular-tree-component";
import {isNullOrUndefined} from "util";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {GoodsService} from "../goods.service";
import {SettingsService} from "../../../core/settings/settings.service";
declare var $: any;

@Component({
  selector: 'app-goodscat',
  templateUrl: './goodscat.component.html',
  styleUrls: ['./goodscat.component.scss']
})

export class GoodscatComponent implements OnInit {
  @Input() isOpen: boolean; //是否开启
  addIsShow: boolean; //遮罩层是否开启
  @Output() close = new EventEmitter(); //关闭
  @Output() parentNodes: EventEmitter<Array<any>> = new EventEmitter(); //父级信息
  nodes: Array<any> = new Array(); //数据源
  selName: string; //选中的信息名
  selCode: string; //选中的信息的code
  inputCategoryName: string; //添加---分类名
  inputSummary: string; //添加---分类说明
  upInfo: any; //修改数据信息
  customTemplateStringOptions = { //树结构参数
    isExpandedField: 'expanded',
    idField: 'uuid',
    allowDrag: true
  };

  constructor(private tools: RzhtoolsService, private goods: GoodsService) {
  }

  ngOnInit() {
    let me = this; //查询分类列表信息
    me.nodes = me.tools.arrayToTree(me.goods.queryGoodsCats(), 'goodsCategoryCode'); //查询并格式化分类列表信息
    me.parentNodes.emit(me.nodes); //给父组件传递数据
  }

  /**
   * 监听组件变化
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    let me = this;
    me.parentNodes.emit(me.nodes); //给父组件传递数据
  }

  /**
   * 关闭类型页面
   */
  closeGoodscat() {
    this.close.emit();
  }

  /**
   * 子节点数量
   * @param node
   * @returns {string}
   */
  childrenCount(node: TreeNode): string {
    return node && node.children ? `(${node.children.length} ` + SettingsService.I18NINFO.swat.e133 + `)` : '';
  }

  /**
   * 设置分类上级编码
   */
  addGoodsType(goodsCategoryCode?: string, categoryName?: string) {
    let me = this;
    me.selName = categoryName, me.selCode = goodsCategoryCode;
  }

  /**
   * 设置要修改的分类的信息
   */
  getUpdateGoodsTypeInfo(data) {
    let me = this;
    me.upInfo = data;
  }

  /**
   * 添加分类信息
   */
  submitGoodsType() {
    let me = this, isTrue: Boolean = false;
    if (isNullOrUndefined(me.inputCategoryName)) { //类型名未填写
      me.tools.rzhAlt("error", SettingsService.I18NINFO.swat.e102, SettingsService.I18NINFO.goods.typeName);
      return;
    }
    isTrue = me.goods.addGoodsType(me.inputCategoryName, me.inputSummary, me.selCode);
    if (isTrue) {
      me.inputCategoryName = null, me.inputSummary = null;//重置信息
      me.nodes = me.tools.arrayToTree(me.goods.queryGoodsCats(), 'goodsCategoryCode'); //查询并格式化分类列表信息
    }
  }

  /**
   * 修改分类信息
   */
  updateGoodsType() {
    let me = this, isTrue: Boolean = false;
    isTrue = me.goods.updateGoodsType(me.upInfo);
    if (isTrue) {
      me.upInfo = null;//重置信息
      me.nodes = me.tools.arrayToTree(me.goods.queryGoodsCats(), 'goodsCategoryCode'); //查询并格式化分类列表信息
    }
  }

}
