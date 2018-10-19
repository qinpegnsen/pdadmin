import {Component, OnInit} from '@angular/core';
import {ExportInfoService} from "../export-info.service";
import {PageEvent} from "angular2-datatable";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {AppComponent} from "../../../app.component";
import {SettingsService} from "../../../core/settings/settings.service";
@Component({
  selector: 'app-calculate',
  templateUrl: './calculate.component.html',
  styleUrls: ['./calculate.component.scss']
})
export class CalculateComponent implements OnInit {

  private listData: any;                               //老师薪资列表预览数据
  private totalData: any;                               //老师薪资列表数据统计
  private teacherList: Array<any> = new Array();   // 教师列表
  private tutorName: string;                         // 老师别名
  private eName: string;                         // 老师实名
  private currencyName: string;                     // 币种的名字
  private courseGeneralType: string='1031';        // 课程需求
  private currency: Array<any> = new Array();      // 币种
  private titleSwitch:boolean=false;      // 搜索内容的展示，默认是隐藏
  private courseCalculateType:number = 1033; // 课时费类型
  private search: any = {
    tutorCode: '',
    createTimeBegin: '',
    createTimeEnd: '',
    currency: 'RMB',
  };                                        // 搜索条件
  constructor(private exportInfoService: ExportInfoService, private tools: RzhtoolsService) {
  }

  ngOnInit() {
    let _this = this;
    _this.teacherList = _this.exportInfoService.getTutorsAll();     // 获取教师列表
    this.currency = _this.tools.getEnumDataList('1032');       //币种
  }

  /**
   * 重置搜索条件
   */
  clearInfo(){
    this.search={
      tutorCode: '',
      createTimeBegin: '',
      createTimeEnd: '',
      currency: 'RMB',
    };
    this.listData=new Array();
    this.totalData=null;
    this.titleSwitch=false;
  }


  /**
   * 搜索模板信息
   */
  searchInfo() {
    let _this=this;
    if(!_this.search.tutorCode){
      AppComponent.rzhMsg('info',SettingsService.I18NINFO.export.selectTutor)
    }else if(!_this.search.createTimeBegin||!_this.search.createTimeEnd){
      AppComponent.rzhMsg('info',SettingsService.I18NINFO.export.selectTime)
    }else{
      _this.titleSwitch=true;
      _this.tutorName=this.exportInfoService.getTutorNmae({tutorCode:this.search.tutorCode}).name; //获取老师的别名
      _this.eName=this.exportInfoService.getTutorNmae({tutorCode:this.search.tutorCode}).eName; //获取老师的实名
      _this.currencyName=this.tools.getEnumDataValByKey('1032',_this.search.currency); //获取币种的名字
      let data=_this.exportInfoService.queryCalculateList(this.search);
      _this.listData = data.tutorHourList; //老师列表数据
      for(let i=0;i<_this.listData.length;i++){
        _this.listData[i].courseGeneralType=_this.resetCourseRequirement(_this.listData[i].courseGeneralType)
      }
      _this.totalData = data.totalTutorHour; //老师列表统计的数据
      _this.totalData.courseGeneralType = JSON.parse(_this.totalData.courseGeneralType);
    }
  }

  /**
   * 导出模板信息
   */
  export() {
    let me=this;
    me.searchInfo();
    if(me.search.tutorCode&&me.search.createTimeBegin&&me.search.createTimeEnd){
      var data = {
        "title": ["课程","课程时间","耗时(小时)", "课程要求", "人数", "最高评分人数","课时费类型", "课时费(每小时)", "课时费小计"
        ], "data": [],"foot":[me.totalData.courseHours,me.totalData.courseGeneralType, me.totalData.stuNum, me.totalData.highOpinionNum ,me.totalData.classHourCost]
      };
      data.foot[1]=me.resetCourseTotalRequirement(data.foot[1]);
      for(let item of me.listData){
        let arr=new Array();
        arr.push(item.courseName,item.courseTimeStr ,item.courseHours,item.courseGeneralType,item.stuNum,item.highOpinionNum,me.tools.getEnumDataValByKey(me.courseCalculateType,item.courseCalculateType),item.basicHourCost,item.classHourCost);
        arr[1]=me.transform(arr[1]);
        data.data.push(arr)
      }
      me.exportInfoService.JSONToExcelConvertorCulculate(data.data, `Ponddy Tutors薪资表(${this.currencyName})`,this.tutorName+"("+this.eName+")",`${this.search.createTimeBegin}～${this.search.createTimeEnd}` ,data.title,data.foot)
    }
  }


  /**
   * 时间转换并切割
   * @param value
   * @param args
   * @returns {string}
   */
  transform(value: any, args?: any): any {
    let arr=value.split('~'),result:string='';

    /**
     * 转化为当地时间并截取所需要的
     */
    for(let i=0;i<arr.length;i++){
      arr[i]=this.tools.UTCToDate(arr[i]);
      if(i==0){
        result+=arr[i]+"~"
      }else{
        result+=arr[i].substr(11,18)
      }
    }
    return result;
  }

  /**
   * 对课堂需求数据整理  如 complex 转化为[0,1,0,0]  其他的3中没有的话都是0
   */
  resetCourseRequirement(value: any){
    let arr=new Array();
    value.indexOf('Simple')!=-1?arr[0]=1:arr[0]=0;
    value.indexOf('Complex')!=-1?arr[1]=1:arr[1]=0;
    value.indexOf('Chineseliterature')!=-1?arr[2]=1:arr[2]=0;
    value.indexOf('SpecialPeriod')!=-1?arr[3]=1:arr[3]=0;
    return arr;
  }

  /**
   * 对课堂需求統計数据整理  如 complex 转化为[0,1,0,0]  其他的3中没有的话都是0
   */
  resetCourseTotalRequirement(value: any){
    let arr=new Array();
    value.Simple?arr[0]=value.Simple:arr[0]=0;
    value.Complex?arr[1]=value.Complex:arr[1]=0;
    value.Chineseliterature?arr[2]=value.Chineseliterature:arr[2]=0;
    value.SpecialPeriod?arr[3]=value.SpecialPeriod:arr[3]=0;
    return arr;
  }
}
