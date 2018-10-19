import {Component, OnInit} from "@angular/core";
import {Page} from "../../../core/page/page";
import {PageEvent} from "angular2-datatable";
import {ActivatedRoute, Router} from "@angular/router";
import {CourseService} from "../course.service";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {isNullOrUndefined} from "util";
import {SettingsService} from "../../../core/settings/settings.service";
import {TREE_ACTIONS, ITreeOptions} from "angular-tree-component";
declare var $: any;

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
  private addOpen = false;                                      // 开启或关闭右侧类型管理中心
  private categoryData: Array<any> = new Array();             //课程体系数据
  private nodes: Array<any> = new Array();                     // 课程体系节点
  private courseData: Page = new Page();                       // 课程数据
  private courseOpen = false;                                  // 右侧开关
  private initData = {
    course: '', categoryCode: '', categoryName: '', duration: '60', studentNum: '1',       // 初始化表格数据
    courseHour: '1',courseGeneralType:'',courseCalculateType:'Basic', state: 'Activate', summary: '',isHot: 'N',
  };
  private isAdd: any = {bl: true, data: this.initData};                  // 右侧添加or修改控制对象
  private courseStateNum:number = 1007; // 课程状态码
  private courseCalculateType:number = 1033; // 课时费类型
  private courseGeneralType:number = 1031; // 课程中总分类

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
            if(!isNullOrUndefined(node.data)) {
              node.focus();
              this.initData.categoryCode = node.data.categoryCode;
              this.initData.categoryName = node.data.category;
              let courses = this.course.getCourseList({curPage: '1', pageSize: '25'}, {categoryCode: node.data.categoryCode});
              this.courseData = new Page(courses);
            };
          }
        }
      },
    }
  };

  constructor(private course: CourseService, private router: Router, private route: ActivatedRoute, private tools: RzhtoolsService) {
  }

  ngOnInit() {
    this.getCategory();
    this.getCourse();
  };

  /**
   * 获取课程体系数据
   */
  getCategory() {
    this.categoryData = this.course.getCategory({curPage: '1', pageSize: '1000'}).voList;
    this.nodes = this.tools.arrayToTree(this.categoryData, 'categoryCode');
  };

  /**
   * 获取课程数据
   * @param {PageEvent} event      Page事件对象
   */
  getCourse(event?: PageEvent) {
    const me = this;
    let activePage = this.courseData.curPage || 1;
    if (typeof event !== 'undefined') {
      activePage = event.activePage;
      sessionStorage.setItem('courseCurPage',String(event.activePage));
    }
    const requestParmas = {
      curPage: Number(sessionStorage.getItem('courseCurPage'))||activePage,
      pageSize: '25'
    };
    const result = this.course.getCourseList(requestParmas, {categoryCode: this.initData.categoryCode}); // 请求管理员列表
    me.courseData = new Page(result);
  };

  /**
   * 开启或关闭右侧类型管理中心
   */
  OpenOrClose() {
    this.addOpen = !this.addOpen;
  };

  /**
   * 添加课程
   */
  addCourse() {
    if(this.initData.categoryCode === ''){
      this.tools.rzhAlt('error', '', SettingsService.I18NINFO.swat.e132);
    }else {
      this.courseOpen = true;
      this.isAdd = {bl: true, data: this.initData};
    };
  };

  /**
   * 修改课程信息
   * @param data       被修改课程对象
   */
  modifyCourse(data) {
    this.courseOpen = true;
    this.isAdd = {bl: false, data: data};
  };

  /**
   * 关闭右侧添加
   */
  closeAdd() {
    this.courseOpen = false;
  };

  /**
   * 树的节点点击事件
   * @param data     出发的节点数据
   */
  onEvent(data) {
    if(!isNullOrUndefined(data)) {
      this.initData.categoryCode = data.categoryCode;
      this.initData.categoryName = data.category;
      let courses = this.course.getCourseList({curPage: '1', pageSize: '25'}, {categoryCode: data.categoryCode});
      this.courseData = new Page(courses);
    };
  };

  /**
   * 跳转至绑定页
   * @param code        课程编码
   */
  goBand(code) {
    this.router.navigate(['/main/cour/course/detail'], {queryParams:{code: code}});
  }


}
