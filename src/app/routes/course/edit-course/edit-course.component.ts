import {Component, OnInit, Output, EventEmitter, Input, ViewChild, OnChanges, OnDestroy} from '@angular/core';
import {CourseService} from '../course.service';
import {RzhtoolsService} from '../../../core/services/rzhtools.service';
import {PatternService} from "../../../core/forms/pattern.service";
import {isNullOrUndefined} from "util";
import {SettingsService} from "../../../core/settings/settings.service";
declare var $: any;
@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss']
})
export class EditCourseComponent implements OnInit, OnChanges {

  private stateList;                                                        // 状态列表
  private courseGeneralTypeList;                                              // 课程总类别
  private courseCalculateTypeList;                                              // 课时费类型
  public isHotList;                                                         // 是否置为热门枚举列表
  private parentList;                                                       // 父类别列表
  private upperClassLimit: Array<number> = new Array();                  //学员上限集合
  @Input() isOpen;                                                          // 右侧开启控制
  @Input() isAdd;                                                           // 添加or修改控制
  @Output() upData = new EventEmitter();                                    // 父组件关闭右侧事件
  @Output() closeAdd = new EventEmitter();                                  // 父组件更新数据时间
  @ViewChild('addCourse') addCourse;
  @ViewChild('course') course;
  @ViewChild('courseGeneralTypeTem') courseGeneralTypeTem;

  constructor(private courseService: CourseService, private tools: RzhtoolsService, public patterns: PatternService) {
  }

  ngOnInit() {
    let _this = this, num: number;
    _this.stateList = _this.courseService.stateList;                                                            // 初始化状态列表
    _this.courseGeneralTypeList = _this.courseService.courseGeneralTypeList;                                     // 初始化状态列表
    _this.courseCalculateTypeList = _this.courseService.courseCalculateTypeList;                                     // 课时费类型
    _this.isHotList = _this.courseService.isHotList;                                     // 是否置为热门枚举列表
    _this.parentList = _this.courseService.getCategory({curPage: 1, pageSize: 100}).voList;        // 初始化父类别列表
    num = _this.tools.getUpperClassLimit(); //获取课程学员上限
    if (!isNullOrUndefined(num) && num > 0) for (let i = 1; i <= num; i++) _this.upperClassLimit.push(i); //封装学员上限集合
  }

  /**
   * 每次输入属性有变化的时候，检测多选框被选中的值
   */
  ngOnChanges() {
    if(this.isAdd.bl){   //如果是新增的话初始化数据
      this.course.reset();   //单独的将这个input空间重置，因为他是已经不是pristinm 和 untouch了
      this.isAdd.data.courseGeneralType='';
      this.isAdd.data.course='';
      this.isAdd.data.duration='60';
      this.isAdd.data.studentNum='1';
      this.isAdd.data.courseHour='1';
      this.isAdd.data.isHot='N';
      this.isAdd.data.state='Activate';
      this.isAdd.data.courseCalculateType='Basic';
      this.isAdd.data.summary='';
    }
    this.resetCheckbox();
    let arr = this.isAdd.data.courseGeneralType.split('、');
    let domArr = $("input[name='courseGeneralType']");
    if (arr.length > 0) {
      for (let i = 0; i < domArr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
          if ($(domArr[i]).prop('value') == arr[j]) {
            $(domArr[i]).prop('checked',true)
            // domArr[i].checked = true;
          }
        }
      }
    }
  }

  /**
   * 有弹框开始的时候重置多选框
   */
  resetCheckbox() {
    let arr = $("input[name='courseGeneralType']");
    if (arr.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        // $(arr[i]).removeAttr('checked')
        $(arr[i]).prop('checked',false)
        // arr[i].checked = false;
      }
    }
  }
  /**
   * 获取课程需求已经选择的值
   */
  tanslateCheckbox() {
    let arr = $("input[name='courseGeneralType']"), returnArr = new Array();
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]['checked']) {
        returnArr.push(this.courseGeneralTypeList[i]['key'])
      }
    }
    return returnArr;
  }


  /**
   * 表单提交事件
   * @param addCategory   表单对象
   */
  onsubmit(addCourse) {
    if (addCourse.valid) {
      let courseRequirement = this.tanslateCheckbox().join('、');//后台要字符串拼接的方式、隔开
      if(!courseRequirement){
        this.tools.rzhAlt('error', '', SettingsService.I18NINFO.swat.e140);
      }else{
        this.isAdd.data.courseGeneralType = courseRequirement;
        if (this.isAdd.bl) {
          this.courseService.addCourse(this.isAdd.data, res => {          //添加课程
            this.upData.emit();
            this.closeAdd.emit();
            // this.addCourse.reset();     //重置有错误  重置的时候重置为上一次的值，  checked  已经变味选择了，所以重置还是选择
          });
        } else {
          this.courseService.modifyCourse(this.isAdd.data, this.isAdd.data.courseCode, res => {     // 修改课程
            this.upData.emit();
            this.closeAdd.emit();
            // this.addCourse.reset();
          });
        }
        ;
      }
    }
    ;
  };

  /**
   * 取消添加
   */
  cancelAdd() {
    // this.addCourse.reset();
    this.closeAdd.emit();
  };

}
