import { Component, OnInit } from '@angular/core';
import {CourseService} from "../course.service";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {PageEvent} from "../../../shared/directives/ng2-datatable/DataTable";
import {Page} from "../../../core/page/page";
import {SettingsService} from "../../../core/settings/settings.service";
import {TREE_ACTIONS, ITreeOptions} from "angular-tree-component";
import {isNullOrUndefined} from "util";
@Component({
  selector: 'app-course-ware',
  templateUrl: './course-ware.component.html',
  styleUrls: ['./course-ware.component.scss']
})
export class CourseWareComponent implements OnInit {
  private categoryData: Array<any> = new Array();             //课程体系数据
  private nodes: Array<any> = new Array();                     // 课程体系节点
  private selectCategoryCode: string;              // 选中课程体系编码
  private addCourseWare: boolean = false;
  private courseWareData: Page = new Page();
  private initData: any = {categoryCode: "", coursewareCode: "", summary: "", title: ""};
  private isAdd: any = {bl: true, data: this.initData};

  private options: ITreeOptions = {    // 树结构参数
    isExpandedField: 'expanded',
    idField: 'uuid',
    allowDrag: false,
    actionMapping: {
      mouse: {
        click: (tree, node, $event) => {
          if (node.hasChildren) {
            TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
          }else {
            if(this.selectCategoryCode !== node.data.categoryCode) {
              node.focus();
              this.selectCategoryCode = node.data.categoryCode;
              this.courseWareData.curPage = 1;
              this.getCoursewareList();
            }
          }
        }
      },
    }
  }

  constructor(private course: CourseService, private tools: RzhtoolsService) { }

  ngOnInit() {
    this.getCategory();
    this.getCoursewareList();
  }

  /**
   * 获取课程体系数据
   */
  getCategory() {
    this.categoryData = this.course.getCategory({curPage: '1', pageSize: '1000'}).voList;
    this.nodes = this.tools.arrayToTree(this.categoryData, 'categoryCode');
  };

  /**
   * 获取课件数据
   * @param {PageEvent} event      Page事件对象
   */
  getCoursewareList(event?: PageEvent) {
    const me = this;
    let activePage = this.courseWareData.curPage || 1;
    if (typeof event !== 'undefined') activePage = event.activePage;
    const requestParmas = {
      curPage: activePage,
      pageSize: '25'
    };
    const result = this.course.getCoursewareList(activePage, 25, me.selectCategoryCode); // 课件列表数据
    me.courseWareData = new Page(result);
  };

  /**
   * 树结构点击时间
   * @param data    被点击节点数据
   */
  onEvent(data) {
    if(this.selectCategoryCode !== data.categoryCode) {
      this.selectCategoryCode = data.categoryCode;
      this.courseWareData.curPage = 1;
      this.getCoursewareList();
    }
  }

  /**
   * 添加课件
   */
  addWare() {
    this.addCourseWare = true;
    this.initData.categoryCode = this.selectCategoryCode;
    this.isAdd = {bl: true, data: this.initData};
  }

  /**
   * 取消添加
   */
  cancelWare() {
    this.addCourseWare = false;
  }

  /**
   * 修改课件
   * @param data
   */
  deleteware(data) {
    let me = this;
    me.course.deleteWare(data, res => {
      this.getCoursewareList();
      me.tools.rzhAlt('success', SettingsService.I18NINFO.course.deleteWareSuccess);
    })
  }

}
