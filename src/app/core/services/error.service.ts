import { Injectable } from '@angular/core';
import {RzhtoolsService} from "./rzhtools.service";

@Injectable()
export class ErrorService {
  public errorCode: any = {
        //-----------------系统异常定义 [9000~9499]--------------------------
        9999: "Server Error",
    9002: "State error",
    9003: "Parameter is ilegal",
    9004: "Parameter is empty",
    9005: "There is already exists",
    9006: "The query result does not exist",
    9010: "There is Error of Account and Password.",

  //-----------------上传文件异常定义[9500~9599]--------------------------
    9500: "Upload failed！",

  //-----------------Zoom异常定义[9600~9699]--------------------------
    9600: "No free resources of zoom",
    9601: "There is zoom already exists",
    9602: "Zoom Result is ilegal",
    9603: "Zoom Create is Failed",

  //-----------------Sproutvideo异常定义[9700~9799]--------------------------
  //-----------------paypal异常定义[9800~9899]--------------------------

  //-----------------notify异常定义[9900~9888]--------------------------
    9900: "There is no tutor's openId error.",
    9901: "Tutor's timezone not setting error.",

  //-----------------学生异常定义[1000~1999]--------------------------
    1000: "There is already exists",
    1001: "There is no student",


  //-----------------老师异常定义[2000~2999]--------------------------
    2000: "There is no Tutor",
    2001: "Add the Tutor failed",
    2002: "Tutor state have to be Actice",
    2003: "The wechat already exists",

  //-----------------助教异常定义[3000~3999]--------------------------
    3001: "Course does not exist",


  //-----------------课程,课表,课堂异常定义[4000~4999]--------------------------
    4000: "Course can not book",
    4001: "The Lesson already started",
    4002: "There is not Enough course hours",
    4003: "It's over the reservation time",
    4004: "Timeout cannot be canceled",
    4005: "The Lesson does not exist",
    4006: "The Lesson  exist",
    4010: "There is no enough lessons",
    // 4006: "Course",
    4007: "Course",
    4008: "course category does not exist",
    4011: "Course",
    4012: "Course Timetable has booked",
    4013: "The Lesson already Confirmed",

  //-----------------商品异常定义[6000~6999]--------------------------
    6000: "Goods",

    6001: "Goods",

    6002: "Goods",

  //-----------------通知异常定义[7000~7999]--------------------------
  //-----------------订单异常定义[8000~8999]--------------------------
    8000: "Order",
    8001: "Order",
    8002: "payment order failed",
    8003: "payment execute failed"
  }

    constructor(private tools: RzhtoolsService) { }

    errorHandle(code: string) {
      this.tools.rzhAlt('error','', this.errorCode['code']);
    };
}
