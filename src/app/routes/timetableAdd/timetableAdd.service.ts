import {Injectable} from "@angular/core";
import {RzhtoolsService} from "../../core/services/rzhtools.service";
import {AjaxService} from "../../core/services/ajax.service";
import {SettingsService} from "../../core/settings/settings.service";
import {Week} from "../assistant/assistant.service";
import * as momentDate from 'moment';
const swal = require('sweetalert');

@Injectable()
export class TimetableServiceAdd {

  constructor(private ajax: AjaxService, private tools: RzhtoolsService) {
  }

  /**
   * 查询可用教师集合
   */
  queryTutors() {
    let _this = this, tutorList: Array<any> = new Array();
    _this.ajax.get({
      url: "/tutor/activatetutors",
      async: false,
      success: function (res) {
        if (res.success) tutorList = res.data;
      }
    });
    return tutorList;
  }

  /**
   * 查询可用教师的课程集合
   */
  queryTutorCourse(tutorCode: string) {
    let _this = this, courseList: any;
    _this.ajax.get({
      url: "/tutor/loadall",
      data: {tutorCode: tutorCode},
      async: false,
      success: function (res) {
        if (res.success) courseList = res.data;
      }
    });
    return courseList;
  }

  /**
   * 查询一个老师的课表信息
   * @param tutorCode 教师编码
   * @param sDate 开始日期
   * @param Edate 结束日期
   */
  queryTimeTable(tutorCode: string, timeZone: string, sDate: string, eDate: string) {
    let _this = this, datas: Array<any> = new Array();
    sDate = _this.tools.timeZoneDateToUTC(sDate + " 00:00:00", timeZone); //开始时区时间转换
    eDate = _this.tools.timeZoneDateToUTC(eDate + " 23:59:59", timeZone); //结束时区时间转换
    _this.ajax.get({
      url: '/timetable/tutor/timetables',
      data: {
        tutorCode: tutorCode,
        // timeZone: timeZone,
        pageSize: "200", //分页长度，一页出来完
        startDate: sDate,
        endDate: eDate
      },
      mask: true,
      async: false,
      success: function (res) {
        if (res.success) datas = res.data.voList;
        else console.log(SettingsService.I18NINFO.swat.e134);
      }
    });
    datas.forEach(ret => {
      ret.courseTime = _this.tools.UTCToTimeZoneDate(ret.courseTime, timeZone); //转换时区
    });
    return datas;
  }

  /**
   * 铺设课表信息
   */
  timetableDefaultInfos(date: Date) {
    let _this = this, newDate: Date, dates: Datas, datesDate: string, datesWeek: string,
      times: Times, timetableData: Array<Datas> = [];
    for (let i = 0; i < 7; i++) { //未来七天信息设置
      dates = new Datas(); //实例化日期
      newDate = _this.tools.getAroundDateByDate(date, i); //获取日期
      datesDate = _this.tools.dataFormat(newDate, "yyyy-MM-dd"); //格式化日期
      datesWeek = _this.tools.getWeek(newDate); //获取周几
      dates.date = datesDate; //设置日期
      dates.week = datesWeek; //设置星期几
      timetableData.push(dates) //设置信息集合
    }
    return timetableData;
  }

  /**
   * 设置装载信息，并标示出可选课表
   * @param datas 可选课表源
   * @param timetableData 铺设信息源
   * @returns {Array<Datas>}
   */
  setTimetableSel(datas: Array<any>, timetableData: Array<Datas>) {
    let _this = this, datasInfo, ttdInfo: Datas, timeInfo: Times, info;
    for (let a = 0; a < timetableData.length; a++) {
      ttdInfo = timetableData[a];
      ttdInfo.times = new Array(); //初始化
      for (let b = 0; b < datas.length; b++) {
        info = datas[b];
        datasInfo= momentDate(info.courseTime).format('YYYY-MM-DD HH:mm:ss');  //解决ie的兼容性问题，所以用这个方法
        // datasInfo = _this.tools.dataFormat(new Date(info.courseTime), "yyyy-MM-dd HH:mm:ss");
        if (ttdInfo.date == datasInfo.substr(0, 10)) {
          timeInfo = new Times();
          timeInfo.courseTime = _this.tools.dateToUnix(info.courseTime); //课程开始时间
          timeInfo.courseEndTime = timeInfo.courseTime + info.duration * 60 * 1000; //课程结束时间
          timeInfo.timetableCode = info.timetableCode; //课程编码
          timeInfo.course = info.course; //设置课程名
          timeInfo.amAndPm = info.amAndPm; //上午或下午
          ttdInfo.times.push(timeInfo);
        }
      }
      ttdInfo.times.sort((a, b) => {
        return a.courseTime - b.courseTime
      });
    }
    return timetableData;
  }


  /**
   * 获取已选课程的对象集合
   * @param timetableData 课表集合
   * @returns {Array<Times>}
   */
  selTimeTableInfo(timetableData: Array<Datas>) {
    let timeList: Array<Times> = [], date: Datas, time: Times;
    for (let i = 0; i < timetableData.length; i++) {
      date = timetableData[i];
      for (let j = 0; j < date.times.length; j++) {
        time = date.times[j];
        if (time.sel) timeList.push(time);
      }
    }
    return timeList;
  }

  /**
   * 加载一个系统参数
   * @param key                        参数键值
   * @returns {any}                    参数值
   */
  loadSetting(key) {
    let result: any = '';
    const me = this;
    me.ajax.get({
      url: '/setting/loadset',
      data: {k: key},
      async: false,
      success: res => {
        res.success ? result = res.data : me.tools.rzhAlt('error', '', SettingsService.I18NINFO.swat.e141);
      },
      error: res => {
        console.log(res);
      }
    });
    return result;
  };

  /**
   * 生成课表添加的信息
   * @param dates  选择的日期
   * @param infos  搜索的一些条件
   * @param advanceTime  允许提前几个小时安排课表
   */
  buildTimeTableInfo(dates: Array<string>, infos: any,advanceTime:number) {
    let loadCourseData=this.loadCourse(infos.courseCode);    //制定课表的的时候传给后台，防止以后更改
    let courseGeneralTypeValue=loadCourseData.courseGeneralType;  //课程需求
    let courseCalculateType=loadCourseData.courseCalculateType;  //课时费类型
    infos.courseGeneralType=courseGeneralTypeValue;
    infos.courseCalculateType=courseCalculateType;
    let ren: Array<TimeTable> = new Array(), timeTable: TimeTable, _this = this, time: any, dataInfo: string;
    for (let date of dates) {
      timeTable = new TimeTable(), dataInfo = date + " " + infos.stime;

      /**
       * 可以对当天几小时内课过滤
       * @type {number}
       */
      let curHour=new Date().getTime();
      // let setHour=new Date(dataInfo).getTime();
      // let setHour=momentDate(dataInfo).format('X');   //解决ie的兼容性问题,获取时间戳
      let setHour=momentDate(dataInfo).valueOf();   //解决ie的兼容性问题,获取时间戳
      if (setHour<curHour+(1000*60*60*advanceTime)){
        continue
      }

      time = momentDate(_this.tools.timeZoneDateToUTC(dataInfo, infos.zones)); //转换时区
      timeTable.tutorCode = infos.tutorCode; //教师编码
      timeTable.courseCode = infos.courseCode; //课程编码
      timeTable.courseGeneralType = infos.courseGeneralType; //课程总分类
      timeTable.courseCalculateType = infos.courseCalculateType; //课程总分类
      timeTable.course = infos.courseName; //课程名
      // timeTable.courseTimeString = _this.tools.dataFormat(time, "yyyy-MM-dd HH:mm:ss"); // 上课时间
      timeTable.courseTimeString = momentDate(time).format('YYYY-MM-DD HH:mm:ss');  //解决ie的兼容性问题，所以用这个方法
      timeTable.week = _this.tools.getWeek(new Date(time)); //获取周几
      timeTable.amAndPm = _this.tools.dataFormat(new Date(time), "HH") < 12 ? "AM" : "PM";
      timeTable.duration = infos.duration; //课程时长
      timeTable.num = infos.num; //学员上限
      timeTable.courseHour = infos.courseHour; //所需课时
      timeTable.courseHourType = infos.courseHourType; //课时类型
      timeTable.state = infos.state; //课表状态
      timeTable.tuTimeZone = infos.zones; //时区信息
      ren.push(timeTable);
    }
    return ren;
  }

  /**
   * load 课程的课程详情，获取总分类
   */
  loadCourse(courseCode){
    let _this = this, result: any ;
    _this.ajax.get({
      url: '/course/load',
      data: {courseCode: courseCode},
      async: false,
      success: function (res) {
        if (res.success){
          result=res.data
        }
        else{
          _this.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e102);
        }
      },
      error: function () {
        _this.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e104);
      }
    })
    return result;
  }

  /**
   * 添加课表信息
   * @param timeTable 课表信息
   */
  addTimeTable(timeTable: Array<TimeTable>) {
    let _this = this, isTrue: Boolean = false;
    _this.ajax.post({
      url: '/timetable/make',
      contentType: "application/json;charset=utf-8",
      data: JSON.stringify(timeTable),
      async: false,
      success: function (res) {
        if (res.success) _this.tools.rzhAlt('success', SettingsService.I18NINFO.swat.e127, res.info), isTrue = true;
        else _this.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e128, SettingsService.I18NINFO.timetable.addError);
      },
      error: function () {
        swal(SettingsService.I18NINFO.swat.e128, SettingsService.I18NINFO.timetable.addMsg, 'error');
      }
    })
    return isTrue;
  }

  /**
   * 删除一节课表信息
   * @param timetableCode 课表标示
   */
  delTimeTable(timetableCode) {
    let _this = this, isTrue: Boolean = false;
    _this.ajax.get({
      url: '/timetable/delete',
      data: {timetableCode: timetableCode},
      async: false,
      success: function (res) {
        if (res.success) _this.tools.rzhAlt('success', SettingsService.I18NINFO.swat.e101, SettingsService.I18NINFO.swat.e130), isTrue = true;
        else _this.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e102, SettingsService.I18NINFO.swat.e142);
      },
      error: function () {
        _this.tools.rzhAlt('error', SettingsService.I18NINFO.swat.e102, SettingsService.I18NINFO.swat.e131);
      }
    })
    return isTrue;
  }

  /**
   * 设置可工作时间段
   * @param weeks
   * @param tutorWorktimes
   */
  setWorktime(weeks: Array<any>, tutorWorktimes: Array<any>) {
    let list: Array<Week> = new Array(), worktimeInfo: Week;
    weeks.forEach(week => {
      list = new Array();
      tutorWorktimes.forEach(worktime => {
        if (worktime.week == week.key) {
          worktimeInfo = new Week("", worktime.startTime, worktime.endTime, worktime.week);
          list.push(worktimeInfo)
        }
      })
      list.sort((a, b) => {
        return Number.parseInt(a.startTime) - Number.parseInt(b.startTime);
      })
      week.worktime = list;
    });
    weeks.sort((a, b) => {
      return a.val - b.val;
    });
    return weeks;
  }

}

/**
 * 日期对象
 */
export class Datas {
  date: string; //日期
  week: any; //周几
  bol: any; //是否工作
  times: Array<Times> = [] //时间集合
}

/**
 * 时间对象
 */
export class Times {
  timetableCode: string; //课表code
  studentCode: string //用户编码
  studentName: string //用户姓名
  studentEmail?: string //用户email
  courseHourType: string //消耗课时类型
  leaveMsg?: string //留言信息
  courseTime: number; //时间
  courseEndTime: number; //时间
  sel?: boolean = false; //是否选中
  amAndPm?: string; //上午 或 下午
  course?: string; //课程名
}

/**
 * 课表对象
 */
export class TimeTable {
  tutorCode: string; //老师编码
  courseCode: string; //课程编码
  course: string; //课程
  courseTimeString: string; //上课时间
  week: string; //星期几
  duration: string; //时长
  amAndPm: string; //上午或下午
  num: string; //预约上限
  advanceTimeString?: string; //提前预约时间
  courseHour: string; //所需课时
  courseHourType: string; //课时类型
  state: string; //状态
  tuTimeZone: string; //时区
  courseGeneralType: string; //课程总分类
  courseCalculateType: string; //课时费类型
}
