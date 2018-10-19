import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {TreeNode} from 'angular-tree-component';
import {isNullOrUndefined} from 'util';
import {RzhtoolsService} from '../../../core/services/rzhtools.service';
import {CourseService} from '../course.service';
import {SettingsService} from "../../../core/settings/settings.service";
import {PatternService} from "../../../core/forms/pattern.service";
declare var $: any;

@Component({
  selector: 'app-coursecat',
  templateUrl: './coursecat.component.html',
  styleUrls: ['./coursecat.component.scss']
})

export class CoursecatComponent implements OnInit {
  @Input() isOpen: boolean; // 是否开启
  @Input() nodes: Array<any>; // 数据源
  @Output() close = new EventEmitter(); // 关闭
  @Output() updateNodes = new EventEmitter();
  private selCode: string; // 选中的信息的code
  private upInfo: any = {}; // 修改数据信息
  private options = { // 树结构参数
    isExpandedField: 'expanded',
    idField: 'uuid',
    allowDrag: false
  };
  private stateList;                                                                  // 状态列表
  private parentList;                                                                 // 父类别列表

  constructor(private tools: RzhtoolsService, private course: CourseService, public patterns: PatternService) {
  }

  ngOnInit() {
    this.stateList = this.course.stateList;              // 初始化状态列表
    this.parentList = this.course.getCategory({curPage: 1, pageSize: 100}).voList;    // 初始化父类别列表
  };

  /**
   * 关闭类型页面
   */
  closeCourse() {
    this.close.emit();
  };

  /**
   * 子节点数量
   * @param node
   * @returns {string}
   */
  childrenCount(node: TreeNode): string {
    return node && node.children ? `(${node.children.length} ` + SettingsService.I18NINFO.swat.e133 + `)` : '';
  };

  /**
   * 设置分类上级编码
   */
  getCode(categoryCode: string) {
    let me = this;
    me.selCode = categoryCode;
  };

  /**
   * 设置要修改的分类的信息
   */
  getInfo(data) {
    let me = this;
    $.extend(true, me.upInfo, data);
  };

  /**
   * 添加分类信息
   */
  addCategory(form) {
    let me = this;
    if (form.valid) {
      let data = form.value;
      data.superCode = me.selCode;
      me.course.addCategory(data, res => {
        me.upInfo = {};          // 重置信息
        me.updateNodes.emit();
      });
    }else{
      me.tools.rzhAlt('error', '', SettingsService.I18NINFO.swat.e140);
    }
    ;
  };

  /**
   * 修改分类信息
   */
  modifyCategory() {
    let me = this;
    me.course.modifyCategory(me.upInfo, me.upInfo.categoryCode, res => {
      me.upInfo = {};          // 重置信息
      me.updateNodes.emit();
    });
  };

}
