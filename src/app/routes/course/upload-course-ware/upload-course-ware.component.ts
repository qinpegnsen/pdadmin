import {Component, OnInit, Output, Input, EventEmitter, ViewChild} from '@angular/core';
import {FileUploader} from "ng2-file-upload";
import {CourseService} from "../course.service";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {FileType} from "ng2-file-upload/file-upload/file-type.class"
import {MaskService} from "../../../core/services/mask.service";
import {SettingsService} from "../../../core/settings/settings.service";
import {CourseWareComponent} from "../course-ware/course-ware.component";
import {PatternService} from "../../../core/forms/pattern.service";
const uploadUrl = "/upload/courseware/file";  //图片上传路径(调取上传的接口)

@Component({
  selector: 'app-upload-course-ware',
  templateUrl: './upload-course-ware.component.html',
  styleUrls: ['./upload-course-ware.component.scss']
})
export class UploadCourseWareComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({      // 上传文件对象
    url: uploadUrl,
    itemAlias: "file",
    isHTML5: true,
    // allowedFileType: ["compress"],
    queueLimit: 1
  }); //初始化上传方法
  private categoryData: Array<any> = new Array();             //课程体系数据

  @Input() isAdd;               // 添加/修改数据
  @Input() addCourseWare;       // 显示/关闭开关
  @Output() cancelWare = new EventEmitter();       // 取消上传事件
  @ViewChild('uploadWare') uploadWare;            // 表单对象

  constructor(private course: CourseService, private tools: RzhtoolsService, public mask: MaskService,public courseware:CourseWareComponent, public patterns: PatternService) {
  }

  ngOnInit() {
    let _this = this;
    _this.categoryData = _this.course.getCategory({curPage: '1', pageSize: '1000'}).voList;
    //上传文件添加判断，限制只能上传zip格式文件
    _this.uploader.onAfterAddingFile = function (fileItem) {
      let isTrue: boolean = false, fileType = fileItem.file.type;
      SettingsService.zipFile.forEach(val => {
        if (fileType == val) isTrue = true;
      });
      if (!isTrue) {
        _this.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e143);
        _this.uploader.removeFromQueue(fileItem);
      }
    }
  }

  /**
   * 上传课件
   * @param data    上传课件的数据
   */
  upload(data) {
    let me = this;
    if(me.uploader.queue.length < 1) {
      me.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e143);
      return; //若未选择文件，不予提交
    }
    let uid = me.tools.uploadUid();   // 获取上传uid
    let type = FileType.getMimeClass(me.uploader.queue[0].file).toUpperCase();    // 获取上传的文件类型
    let coursewareCode: string;

    //添加上传监听函数，为每个文件绑定uid;
    me.uploader.onBuildItemForm = function (fileItem, form) {
      me.mask.showMask(); //锁屏
      form.append('uid', uid);
    }

    /**
     * 上传成功回调
     * @param item 成功的文件
     * @param response 返回信息
     * @param status 状态码
     * @param headers 上传成功后服务器的返回的返回头
     */
    me.uploader.onSuccessItem = function (item, response, status, headers) {
      me.mask.hideMask(); //解除锁屏
      let res = JSON.parse(response);
      if (res.success) {
        me.course.bandCourseware(coursewareCode, uid, res => {
          me.uploadWare.reset();
          me.uploader.clearQueue();
          me.cancelWare.emit();
          me.tools.rzhAlt('success', SettingsService.I18NINFO.swat.e127);
        });
        me.courseware.getCoursewareList(); //刷新页面
      } else {
        me.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e136);
      }
    }

    /**
     * 上传失败处理
     * @param item 失败的文件列表
     * @param response 返回信息
     * @param status 状态码
     * @param headers 上传失败后服务器的返回的返回头
     */
    me.uploader.onErrorItem = function (item, response, status, headers) {
      me.mask.hideMask(); //解除锁屏
      me.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e136);
    }

    //如果输入有效执行上传
    if (data.valid) {
      me.mask.showMask(); //锁屏
      me.course.addCourseware(data.value, type, res => {
        me.mask.hideMask(); //解除锁屏
        coursewareCode = res.data.coursewareCode;
        this.uploader.uploadAll();
      })
    }
  };

  /**
   * 修改课件数据
   * @param data        // 要修改的新数据
   * @param coursewareCode      // 课件编码
   */
  modify(data, coursewareCode) {
    if (data.valid) {
      this.mask.showMask(); //解除锁屏
      this.course.modifyCourseWare(data.value, coursewareCode, res => {
        this.mask.hideMask(); //解除锁屏
        this.uploadWare.reset();
        this.uploader.clearQueue();
        this.cancelWare.emit();
        this.tools.rzhAlt('success', SettingsService.I18NINFO.swat.e124);
      })
    }
  }

  /**
   * 表单提交事件
   * @param data    // 表单数据
   */
  onSubmit(data) {
    if (this.isAdd.bl) {
      this.upload(data);
    } else {
      this.modify(data, this.isAdd.data.coursewareCode);
    }
  };

}
