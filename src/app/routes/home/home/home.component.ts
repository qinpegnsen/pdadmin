import {Component, OnInit} from '@angular/core';
import {HomeService} from "../home.service";
import {isNullOrUndefined} from "util";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {TimetableServiceAdd} from "../../timetableAdd/timetableAdd.service";
import {AppComponent} from "../../../app.component";
import {Router} from "@angular/router";
import {SettingsService} from "../../../core/settings/settings.service";

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private tutorNum: number; //教师个数
  private orderNum: number; //订单总数
  private bookingNum: number;  //预约数
  private classroomOverNum: number; //已完成的上课数
  private orderStateTotalOption: any; //订单分类统计
  private classroomTotalFor6MonthOption: any; //近六个月的上课数
  private tutorsList: Array<any> = new Array(); //可用教师集合
  private selTutor: string; //被选中的教师
  private orderStateNum: number = 1012; //订单状态编码

  constructor(private homeService: HomeService, private tools: RzhtoolsService, private timetable: TimetableServiceAdd, private router: Router) {
  }

  ngOnInit() {
    let _this = this, orderStateTotal: Array<any> = new Array(), legendData: Array<string> = new Array(),
      datas: Array<any> = new Array(), name: string, classroomTotalFor6Month: Array<any> = new Array(),
      months: Array<string> = new Array(), nums: Array<number> = new Array();
    _this.tutorNum = _this.homeService.tutorNum(); //获取教师个数
    _this.orderNum = _this.homeService.orderNum(); //获取订单总数
    _this.bookingNum = _this.homeService.bookingNum(); //获取预约数
    _this.classroomOverNum = _this.homeService.classroomOverNum(); //获取已完成的上课数

    //分状态统计订单数 begin
    orderStateTotal = _this.homeService.orderStateTotal();
    if (isNullOrUndefined(orderStateTotal)) orderStateTotal = new Array();
    for (let info of orderStateTotal) {
      name = _this.tools.getEnumDataValByKey(_this.orderStateNum, info.state);
      legendData.push(name); //设置状态提示
      datas.push({name: name, value: info.num}) //设置数据显示
    }
    if (legendData.length < 1) { //设置默认信息
      legendData.push(SettingsService.I18NINFO.home.noOrder);
      datas.push({name: SettingsService.I18NINFO.home.noOrder, value: 0});
    }
    //绘制图表
    _this.orderStateTotalOption = {
      title: {
        text: SettingsService.I18NINFO.home.orderTypeNum,
        subtext: SettingsService.I18NINFO.home.typeTitle,
        x: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: legendData
      },
      color: ['#89cccf', '#badf8f', '#5c99f2', '#91dbf1', '#cbebf6', '#7266ba', '#ff902b'],
      series: [
        {
          name: SettingsService.I18NINFO.home.countNum,
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: datas,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
    //分状态统计订单数 end

    //统计近六个月的上课数 begin
    classroomTotalFor6Month = _this.homeService.classroomTotalFor6Month();
    for (let info of classroomTotalFor6Month) {
      months.push(info.month); //设置月份
      nums.push(info.num); //设置月份
    }
    _this.classroomTotalFor6MonthOption = {
      color: ['#3398DB'],
      title: {
        text: SettingsService.I18NINFO.home.halfAYearTotal,
        subtext: SettingsService.I18NINFO.home.totalByMonth,
        x: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      xAxis: [
        {
          type: 'category',
          data: months,
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          splitNumber: 1
        }
      ],
      series: [
        {
          name: SettingsService.I18NINFO.home.classNum,
          type: 'bar',
          barWidth: '60%',
          data: nums
        }
      ]
    };
    //统计近六个月的上课数 end

    //查询可用教师集合
    if (_this.tutorsList.length < 1) {
      _this.tutorsList = _this.timetable.queryTutors();
      if (!_this.tutorsList) _this.tutorsList = new Array();
    }
  }

  /**
   * 设置课表
   */
  setTimetable() {
    let _this = this;
    if (isNullOrUndefined(_this.selTutor)) {
      AppComponent.rzhMsg("error", SettingsService.I18NINFO.home.selTeacher);
    } else {
      _this.router.navigate(["/main/tTableAdd"], {queryParams: {code: _this.selTutor}});
    }
  }
}
