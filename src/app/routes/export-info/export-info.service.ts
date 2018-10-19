import {Injectable} from '@angular/core';
import {isNullOrUndefined} from "util";
import {AppComponent} from "../../app.component";
import {SettingsService} from "../../core/settings/settings.service";
import {RzhtoolsService} from "../../core/services/rzhtools.service";
import {AjaxService} from "../../core/services/ajax.service";

@Injectable()
export class ExportInfoService {

  constructor(private ajax: AjaxService, private tools: RzhtoolsService) {
  }

  /**
   * 查老师模板列表信息
   * @param curPage 当前页
   * @param pageSize 每页条数
   * @param datas 查询参数
   */
  queryTutorTemList(curPage, pageSize, data?: any) {
    let rList: any;
    const requestParmas = {
      curPage: curPage,
      pageSize: pageSize,
      tutorCode: data ? data.tutorCode : '',
      courseCode: data ? data.courseCode : '',
      startStr: data ? data.createTimeBegin : '',
      endStr: data ? data.createTimeEnd : '',
      state: data ? data.state : '',
    };
    const _this = this;
    // Object.assign(qData, datas); //设置查询参数            //这里后台转化成了国际时间，我这里就不需要转换了
    // //时区转换
    // if (!isNullOrUndefined(qData.createTimeBegin) && qData.createTimeBegin != "") qData.createTimeBegin = _this.tools.dateToUTC(qData.createTimeBegin);
    // if (!isNullOrUndefined(qData.createTimeEnd) && qData.createTimeEnd != "") qData.createTimeEnd = _this.tools.dateToUTC(qData.createTimeEnd);
    _this.ajax.get({
      url: '/export/queryTutorExportData',
      data: requestParmas,
      mask: true,
      async: false,
      success: (res) => {
        if (res.success) rList = res.data; else AppComponent.rzhMsg("error", SettingsService.I18NINFO.swat.e134);
      },
      error: (res) => {
        AppComponent.rzhMsg("error", SettingsService.I18NINFO.swat.e134);
      }
    });
    //结果集时区转换为当前时区
    if (!isNullOrUndefined(rList) && rList != "") {
      let voList: Array<any> = rList.voList;
      if (!isNullOrUndefined(voList)) {
        voList.forEach(ret => {
          ret.createTime = _this.tools.UTCToDate(ret.createTime);
        })
      }
    }
    return rList;
  }

  /**
   * 查老师薪资列表信息
   * @param curPage 当前页
   * @param pageSize 每页条数
   * @param datas 查询参数
   */
  queryCalculateList(data?: any) {
    let rList: any;
    const requestParmas = {
      tutorCode: data ? data.tutorCode : '',
      startStr: data ? data.createTimeBegin : '',
      endStr: data ? data.createTimeEnd : '',
      coinType: data ? data.currency : '',
    };
    const _this = this;
    // Object.assign(qData, datas); //设置查询参数    //这里后台转化成了国际时间，我这里就不需要转换了
    // //时区转换
    // if (!isNullOrUndefined(qData.createTimeBegin) && qData.createTimeBegin != "") qData.createTimeBegin = _this.tools.dateToUTC(qData.createTimeBegin);
    // if (!isNullOrUndefined(qData.createTimeEnd) && qData.createTimeEnd != "") qData.createTimeEnd = _this.tools.dateToUTC(qData.createTimeEnd);
    _this.ajax.get({
      url: '/export/exportTutorClassHours',
      data: requestParmas,
      mask: true,
      async: false,
      success: (res) => {
        if (res.success) rList = res.data; else AppComponent.rzhMsg("error", SettingsService.I18NINFO.swat.e134);
      },
      error: (res) => {
        AppComponent.rzhMsg("error", SettingsService.I18NINFO.swat.e134);
      }
    });
    //结果集时区转换为当前时区
    if (!isNullOrUndefined(rList) && rList != "") {
      let voList: Array<any> = rList.voList;
      if (!isNullOrUndefined(voList)) {
        voList.forEach(ret => {
          ret.createTime = _this.tools.UTCToDate(ret.createTime);
        })
      }
    }
    return rList;
  }

  /**
   * 查学生模板列表信息
   * @param curPage 当前页
   * @param pageSize 每页条数
   * @param datas 查询参数
   */
  queryStuTemList(curPage, pageSize, data?: any) {
    let rList: any;
    const requestParmas = {
      curPage: curPage,
      pageSize: pageSize,
      studentCode: data ? data.stuCode : '',
      courseCode: data ? data.courseCode : '',
      startStr: data ? data.createTimeBegin : '',
      endStr: data ? data.createTimeEnd : '',
      state: data ? data.state : '',
    };
    const _this = this;
    // Object.assign(qData, datas); //设置查询参数          //这里后台转化成了国际时间，我这里就不需要转换了
    // //时区转换
    //if (!isNullOrUndefined(qData.createTimeBegin) && qData.createTimeBegin != "") qData.createTimeBegin = _this.tools.dateToUTC(qData.createTimeBegin);
    // if (!isNullOrUndefined(qData.createTimeEnd) && qData.createTimeEnd != "") qData.createTimeEnd = _this.tools.dateToUTC(qData.createTimeEnd);
    _this.ajax.get({
      url: '/export/queryStudentExportData',
      data: requestParmas,
      mask: true,
      async: false,
      success: (res) => {
        if (res.success) rList = res.data; else AppComponent.rzhMsg("error", SettingsService.I18NINFO.swat.e134);
      },
      error: (res) => {
        AppComponent.rzhMsg("error", SettingsService.I18NINFO.swat.e134);
      }
    });
    //结果集时区转换为当前时区
    if (!isNullOrUndefined(rList) && rList != "") {
      let voList: Array<any> = rList.voList;
      if (!isNullOrUndefined(voList)) {
        voList.forEach(ret => {
          ret.createTime = _this.tools.UTCToDate(ret.createTime);
        })
      }
    }
    return rList;
  }

  /**
   * 导出老师模板列表
   * @param datas
   * @returns {any}
   */
  exportTutorTemList(datas?: any) {
    let rList: any;
    const _this = this;
    _this.ajax.get({
      url: '/export/exportTutorClassInfo',
      data: datas,
      mask: true,
      async: false,
      success: (res) => {
        if (res.success) rList = res.data; else AppComponent.rzhMsg("error", SettingsService.I18NINFO.swat.e134);
      },
      error: (res) => {
        AppComponent.rzhMsg("error", SettingsService.I18NINFO.swat.e134);
      }
    });
    return rList;
  }

  /**
   * 导出学生模板列表
   * @param datas
   * @returns {any}
   */
  exportStuTemList(datas?: any) {
    let rList: any;
    const _this = this;
    _this.ajax.get({
      url: '/export/exportStudentClassInfo',
      data: datas,
      mask: true,
      async: false,
      success: (res) => {
        if (res.success) rList = res.data; else AppComponent.rzhMsg("error", SettingsService.I18NINFO.swat.e134);
      },
      error: (res) => {
        AppComponent.rzhMsg("error", SettingsService.I18NINFO.swat.e134);
      }
    });
    return rList;
  }

  /**
   * 查询老师获取课程
   *
   * @param {string} curPage      // 当前页
   * @param {string} pageSize     // 分页大小
   * @returns {any}               //返回课程对象
   */
  getTutorCourseList(requestParmas: any) {
    let result = {voList: []};
    const me = this;
    me.ajax.get({
      url: '/tutor/loadall',
      data: requestParmas,
      async: false,
      success: res => {
        res.success ? result = res.data.tutorCourses || {tutorCourses: []} : me.tools.rzhAlt('error', '', SettingsService.I18NINFO.swat.e134);
      },
      error: res => {
        console.log(res);
      }
    });
    return result;
  };

  /**
   * 查询老师的信息
   *requestParmas
   *
   */
  getTutorNmae(requestParmas: any) {
    let result: any;
    const me = this;
    me.ajax.get({
      url: '/tutor/load',
      data: requestParmas,
      async: false,
      success: res => {
        res.success ? result = res.data || {tutorCourses: []} : me.tools.rzhAlt('error', '', SettingsService.I18NINFO.swat.e134);
      },
      error: res => {
        console.log(res);
      }
    });
    return result;
  };

  /**
   * 查询课程列表
   *
   * @param {string} curPage      // 当前页
   * @param {string} pageSize     // 分页大小
   * @returns {any}               //返回课程对象
   */
  getCourseList(requestParmas: any) {
    let result = {voList: []};
    const me = this;
    me.ajax.get({
      url: '/course/list',
      data: requestParmas,
      async: false,
      success: res => {
        res.success ? result = res.data || {tutorCourses: []} : me.tools.rzhAlt('error', '', SettingsService.I18NINFO.swat.e134);
      },
      error: res => {
        console.log(res);
      }
    });
    return result;
  };


  /**
   * 获取可用老师列表
   * @returns {Array<any>}    //返回老师数组
   */
  getTutorsAll() {
    let result: Array<any> = new Array();
    const me = this;
    me.ajax.get({
      url: '/tutor/activatetutors',
      async: false,
      success: res => {
        res.success ? result = res.data || [] : me.tools.rzhAlt('error', '', SettingsService.I18NINFO.assistant.queryErr);
      },
      error: res => {
        console.log(res);
      }
    });
    return result;
  };

  /**
   * 获取学生列表
   * @returns {Array<any>}    //返回老师数组
   */
  getStusAll() {
    let result: Array<any> = new Array();
    const me = this;
    let data = {
      curPage: '1',
      pageSize: '999'
    };
    me.ajax.get({
      url: '/student/list',
      async: false,
      data: data,
      success: res => {
        res.success ? result = res.data.voList || [] : me.tools.rzhAlt('error', '', SettingsService.I18NINFO.assistant.queryErr);
      },
      error: res => {
        console.log(res);
      }
    });
    return result;
  };


  /**
   * json 转换成execl文件的方法(教师上课时数导出)
   * @param JSONData       表格的具体的内容
   * @param FileName       表格的大标题
   * @param ShowLabel      表格的列标题
   * @constructor
   */
  JSONToExcelConvertor(JSONData, FileName, ShowLabel) {
    //先转化json
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    var excel = '<table>';

    //设置表头 大标题
    var rowTitle = "<tr>";
    let colspanNum = ShowLabel.length + '';
    rowTitle += `<td colspan=${colspanNum}  style='text-align: center;font-size: 20px;font-weight: 800'>${FileName}</td>`;
    excel += rowTitle + "</tr>";

    //设置表头 列标题
    var row = "<tr>";
    for (var i = 0, l = ShowLabel.length; i < l; i++) {
      row += "<td align='center' valign='middle' style='text-align: center;font-size: 16px;font-weight: 700'>" + ShowLabel[i] + '</td>';
    }
    //换行
    excel += row + "</tr>";

    //设置数据
    for (var i = 0; i < arrData.length; i++) {
      var row = "<tr>";

      for (var index in arrData[i]) {
        var value = arrData[i][index] === "." ? "" : arrData[i][index];
        if (!value || value == '0.0') {
          value = "-"
        }
        row += "<td align='center' valign='middle' style='text-align: center;font-size: 14px;'>" + value + '</td>';
      }

      excel += row + "</tr>";
    }

    excel += "</table>";

    var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
    excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
    excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';
    excelFile += '; charset=UTF-8">';
    excelFile += "<head>";
    excelFile += "<!--[if gte mso 9]>";
    excelFile += "<xml>";
    excelFile += "<x:ExcelWorkbook>";
    excelFile += "<x:ExcelWorksheets>";
    excelFile += "<x:ExcelWorksheet>";
    excelFile += "<x:Name>";
    excelFile += "{worksheet}";
    excelFile += "</x:Name>";
    excelFile += "<x:WorksheetOptions>";
    excelFile += "<x:DisplayGridlines/>";
    excelFile += "</x:WorksheetOptions>";
    excelFile += "</x:ExcelWorksheet>";
    excelFile += "</x:ExcelWorksheets>";
    excelFile += "</x:ExcelWorkbook>";
    excelFile += "</xml>";
    excelFile += "<![endif]-->";
    excelFile += "</head>";
    excelFile += "<body>";
    excelFile += excel;
    excelFile += "</body>";
    excelFile += "</html>";

    var uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile);

    var link = document.createElement("a");
    link.href = uri;

    // link.style = "visibility:hidden";
    link.download = FileName + ".xls";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * json 转换成execl文件的方法(教师薪资计算导出)
   * @param JSONData       表格的具体的内容
   * @param FileName       表格的大标题
   * @param tutorName       表格的大标题(老师姓名)
   * @param time            表格的大标题(时间)
   * @param ShowLabel      表格的列标题
   * @param ShowLabel      表格的底部
   * @constructor
   */
  JSONToExcelConvertorCulculate(JSONData, FileName, tutorName, time, ShowLabel, footData) {
    //先转化json
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    var excel = '<table>';

    //设置表头 大标题
    var rowTitle = "<tr>";
    let colspanNum = ShowLabel.length + '';
    rowTitle += `<td colspan=${colspanNum}  style='text-align: center;font-size: 20px;font-weight: 800'>${FileName}<br style='mso-data-placement:same-cell;'/>${tutorName}<br style='mso-data-placement:same-cell;'/>${time}</td>`;
    excel += rowTitle + "</tr>";

    //设置表头 列标题
    var row = "<tr>";
    for (var i = 0, l = ShowLabel.length; i < l; i++) {
      if (i == 3) {
        row += `<td align='center'  valign='middle' style='text-align: center;font-size: 16px;font-weight: 700'>${ShowLabel[i]}<table><tbody><tr align='center'  valign='middle' style='text-align: center;font-size: 16px;font-weight: 700'><td>简单</td><td>复杂</td><td>国学</td><td>特殊时段</td></tr></tbody></table></td>`;
      } else {
        row += "<td align='center'  valign='middle' style='text-align: center;font-size: 16px;font-weight: 700'>" + ShowLabel[i] + '</td>';
      }
    }
    //换行
    excel += row + "</tr>";

    //设置数据
    for (var i = 0; i < arrData.length; i++) {
      var row = "<tr>";


      for (var index in arrData[i]) {
        let value = arrData[i][index];
        if (index == '3') {
          row += `<td align='center' valign='middle' style='text-align: center;font-size: 14px;'><table><tbody><tr align='center' valign='middle' style='text-align: center;font-size: 14px;'><td>${value[0]}</td><td>${value[1]}</td><td>${value[2]}</td><td>${value[3]}</td></tr></tbody></table></td>`;
        } else {
          row += "<td align='center' valign='middle' style='text-align: center;font-size: 14px;'>" + value + '</td>';
        }
      }

      excel += row + "</tr>";
    }

    // //设置foot 列表
    var row = "<tr>";
    for (var i = 0, l = footData.length; i < l; i++) {
      if (i == 0) {
        row += "<td align='center' colspan='2' valign='middle' style='text-align: right;font-size: 16px;font-weight: 700'>统计：" + '</td>';
        row += "<td align='center' valign='middle' style='text-align: center;font-size: 16px;font-weight: 700'>" + footData[i] + '</td>';
      } else if (i == footData.length - 1) {
        row += "<td align='center' colspan='3' valign='middle' style='text-align: center;font-size: 16px;font-weight: 700'> 总课时费：" + footData[i] + '</td>';
      } else if (i == 1) {
        let value = footData[i];
        row += `<td><table><tbody><tr  valign='middle' style='text-align: center;font-size: 16px;font-weight: 700'><td>${value[0]}</td><td>${value[1]}</td><td>${value[2]}</td><td>${value[3]}</td></tr></tbody></table></td>`;
      } else {
        row += "<td align='center' *ngIf='i!=0&&i==ShowLabel.length-1' valign='middle' style='text-align: center;font-size: 16px;font-weight: 700'>" + footData[i] + '</td>';
      }

    }

    //换行
    excel
      +=
      row
      +
      "</tr>";

    excel
      +=
      "</table>";
    //  测试写的table
    // var div = document.createElement('div');
    // div.style.marginLeft = '500px';
    // div.innerHTML = excel;
    // document.body.appendChild(div);

    var
      excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
    excelFile
      +=
      '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
    excelFile
      +=
      '<meta http-equiv="content-type" content="application/vnd.ms-excel';
    excelFile
      +=
      '; charset=UTF-8">';
    excelFile
      +=
      "<head>";
    excelFile
      +=
      "<!--[if gte mso 9]>";
    excelFile
      +=
      "<xml>";
    excelFile
      +=
      "<x:ExcelWorkbook>";
    excelFile
      +=
      "<x:ExcelWorksheets>";
    excelFile
      +=
      "<x:ExcelWorksheet>";
    excelFile
      +=
      "<x:Name>";
    excelFile
      +=
      "{worksheet}";
    excelFile
      +=
      "</x:Name>";
    excelFile
      +=
      "<x:WorksheetOptions>";
    excelFile
      +=
      "<x:DisplayGridlines/>";
    excelFile
      +=
      "</x:WorksheetOptions>";
    excelFile
      +=
      "</x:ExcelWorksheet>";
    excelFile
      +=
      "</x:ExcelWorksheets>";
    excelFile
      +=
      "</x:ExcelWorkbook>";
    excelFile
      +=
      "</xml>";
    excelFile
      +=
      "<![endif]-->";
    excelFile
      +=
      "</head>";
    excelFile
      +=
      "<body>";
    excelFile
      +=
      excel;
    excelFile
      +=
      "</body>";
    excelFile
      +=
      "</html>";


    var
      uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile); //base 64位的地址，没有网络请求

    var
      link = document.createElement("a");
    link
      .href = uri;

    // link.style = "visibility:hidden";
    link
      .download = FileName + ".xls";

    document
      .body
      .appendChild(link);

    link
      .click();

    document
      .body
      .removeChild(link);


  }

}
