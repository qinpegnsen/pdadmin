import {Component, OnInit} from '@angular/core';
import {RzhtoolsService} from '../../../core/services/rzhtools.service';
import {AssistantService} from '../../assistant/assistant.service';
import {Page} from '../../../core/page/page';
import {PageEvent} from '../../../shared/directives/ng2-datatable/DataTable';
import {isNullOrUndefined} from "util";
import {Router, ActivatedRoute} from "@angular/router";
import {SettingsService} from "../../../core/settings/settings.service";
import {ClassroomService} from "../../classroom/classroom.service";
import {Location} from '@angular/common';
import {QuestionnaireService} from "../questionnaire.service";
const swal = require('sweetalert');
@Component({
  selector: 'app-questionnaire-detail',
  templateUrl: './questionnaire-detail.component.html',
  styleUrls: ['./questionnaire-detail.component.scss']
})
export class QuestionnaireDetailComponent implements OnInit {

  private stuData: any;              // 问卷调查记录学生填写数据
  private tutorData: any;            // 问卷调查记录老师填写数据
  private classroomCode: any;         //课堂编码
  private tutorCode: any;            //教师编码
  private classromeData: any;         //课堂数据
  private totalData: any;            //课堂回馈表的所有的数据


  constructor(private route: ActivatedRoute, private location: Location, private questionnaireService: QuestionnaireService) {
  }

  ngOnInit() {
    let _this = this;
    _this.classroomCode = _this.route.snapshot.params['classroomCode']; //路由中获取上页列表的查询信息
    _this.tutorCode = _this.route.snapshot.params['tutorCode']; //路由中获取上页列表的查询信息
    _this.classromeData = _this.questionnaireService.loadClassrome(_this.classroomCode, _this.tutorCode);  //加载课堂的信息
    _this.totalData = _this.questionnaireService.loadStudentQuestionnaireRecord(_this.classroomCode);
    _this.getstuData();    // 获取学生填写的课堂回馈记录
    _this.getTutorData();    // 获取老师填写的课堂回馈记录
  };

  /**
   * 获取学生填写的课堂回馈记录
   *
   */
  getstuData() {
    const me = this;
    let stuTotalData: any = {
      questionNaireRecord: new Array(),
      feedbackRecord: new Array()
    };  //存储学生填的问卷信息


    /**
     * 获取学生对老师的问卷信息
     */
    if (this.totalData['classroomStudentses'].length > 0) {
      /**
       * 存储学生填的问卷问题
       */
      for (let i = 0; i < this.totalData['classroomStudentses'].length; i++) {
        if (this.totalData['classroomStudentses'][i].classroomQuestionnaireRecordList.length > 0) {
          for (let j = 0; j < this.totalData['classroomStudentses'][i]['classroomQuestionnaireRecordList'].length; j++) {
            let obj: any = {
              questionContent: '',
              questionStar: '',
              score: new Array()
            };
            obj.questionContent = this.totalData['classroomStudentses'][i]['classroomQuestionnaireRecordList'][j].classroomQuestionnaireContent.questionContent;
            stuTotalData.questionNaireRecord.push(obj);
          }
          break
        }
      }


      /**
       * 学生单独的打分和平均得分和星级还有问答题
       */
      let isFeedBackNum: number = 0;     //填过问卷表的学生
      for (let i = 0; i < this.totalData['classroomStudentses'].length; i++) {
        /**
         * 学生单独的打分和平均得分
         */
        if (this.totalData['classroomStudentses'][i].classroomQuestionnaireRecordList.length > 0) {
          isFeedBackNum++;
          for (let j = 0; j < this.totalData['classroomStudentses'][i].classroomQuestionnaireRecordList.length; j++) {
            let accumulated: number = i > 0 ? this.totalData['classroomStudentses'][i - 1].classroomQuestionnaireRecordList.length > 0 ? this.totalData['classroomStudentses'][i - 1].classroomQuestionnaireRecordList[j].questionStar : 0 : 0;

            /**
             * 所有学生的平均得分
             */
            stuTotalData.questionNaireRecord[j].questionStar = this.totalData['classroomStudentses'][i].classroomQuestionnaireRecordList[j].questionStar + accumulated;
            if (i == this.totalData['classroomStudentses'].length - 1) {
              stuTotalData.questionNaireRecord[j].questionStar = stuTotalData.questionNaireRecord[j].questionStar / isFeedBackNum;
            }

            /**
             * 每个学生对应的得分
             */
            let obj = {
              studentName: '',
              questionStar: ''
            }, tempArr = new Array();
            obj.studentName = this.totalData['classroomStudentses'][i].classroomQuestionnaireRecordList[j].studentName;
            obj.questionStar = this.totalData['classroomStudentses'][i].classroomQuestionnaireRecordList[j].questionStar;
            stuTotalData.questionNaireRecord[j].score.push(obj);
          }
        }
        /**
         * 星级还有问答题
         */
        stuTotalData.feedbackRecord.push(this.totalData['classroomStudentses'][i].classroomFeedback)
      }
    }
    me.stuData = stuTotalData;
  };

  /**
   * 获取老师填写的课堂回馈记录
   *
   */
  getTutorData() {
    const me = this;

    let tutorData: any = {
      questionNaireRecord: new Array(),
      feedbackRecord: new Array()
    };  //存储学生填的问卷信息


    /**
     * 进行数据重组，每个学生问卷记录分开(因为老师之是一个，所以这里用的是0)
     */
    if (me.totalData['classroomTutors'].length > 0) {
      for (let i = 0; i < me.totalData['classroomTutors'][0].classroomFeedbackList.length; i++) {
        for (let j = 0; j < me.totalData['classroomTutors'][0].classroomQuestionnaireRecordList.length; j++) {
          let tempArr = new Array();
          if (me.totalData['classroomTutors'][0].classroomFeedbackList[i].studentCode == me.totalData['classroomTutors'][0].classroomQuestionnaireRecordList[j].studentCode) {
            if (!isNullOrUndefined(me.totalData['classroomTutors'][0].classroomFeedbackList[i].questionnaireRecordList)) {
              me.totalData['classroomTutors'][0].classroomFeedbackList[i].questionnaireRecordList.push(me.totalData['classroomTutors'][0].classroomQuestionnaireRecordList[j])
            } else {
              tempArr.push(me.totalData['classroomTutors'][0].classroomQuestionnaireRecordList[j]);
              me.totalData['classroomTutors'][0].classroomFeedbackList[i].questionnaireRecordList = tempArr;
            }
          }
        }
      }
    }


    /**
     * 存储老师填的问卷问题
     */
    if (this.totalData['classroomTutors'][0]['classroomFeedbackList'].length > 0) {
      for (let j = 0; j < this.totalData['classroomTutors'][0]['classroomFeedbackList'][0]['questionnaireRecordList'].length; j++) {
        let obj: any = {
          questionContent: '',
          questionStar: '',
          score: new Array()
        };
        obj.questionContent = this.totalData['classroomTutors'][0]['classroomFeedbackList'][0]['questionnaireRecordList'][j].classroomQuestionnaireContent.questionContent;
        tutorData.questionNaireRecord.push(obj);
      }
    }


    /**
     * 老师单独的打分和平均得分和星级还有问答题
     */
    for (let i = 0; i < this.totalData['classroomTutors'][0].classroomFeedbackList.length; i++) {
      /**
       * 老师单独的打分和平均得分
       */
      if (this.totalData['classroomTutors'][0].classroomFeedbackList.length > 0) {
        for (let j = 0; j < this.totalData['classroomTutors'][0].classroomFeedbackList[i].questionnaireRecordList.length; j++) {
          let accumulated: number = i > 0 ? this.totalData['classroomTutors'][0].classroomFeedbackList[i - 1].questionnaireRecordList.length > 0 ? this.totalData['classroomTutors'][0].classroomFeedbackList[i - 1].questionnaireRecordList[j].questionStar : 0 : 0;

          // /**
          //  * 所有学生的平均得分
          //  */
          tutorData.questionNaireRecord[j].questionStar = this.totalData['classroomTutors'][0].classroomFeedbackList[i].questionnaireRecordList[j].questionStar + accumulated;
          if (i == this.totalData['classroomTutors'][0].classroomFeedbackList.length - 1) {
            tutorData.questionNaireRecord[j].questionStar = tutorData.questionNaireRecord[j].questionStar / this.totalData['classroomTutors'][0].classroomFeedbackList.length;
          }

          /**
           * 每个学生对应的得分
           */
          let obj = {
            studentName: '',
            questionStar: ''
          }, tempArr = new Array();
          obj.studentName = this.totalData['classroomTutors'][0].classroomFeedbackList[i].questionnaireRecordList[j].studentName;
          obj.questionStar = this.totalData['classroomTutors'][0].classroomFeedbackList[i].questionnaireRecordList[j].questionStar;
          tutorData.questionNaireRecord[j].score.push(obj);
        }
      }
      /**
       * 星级还有问答题
       */
      tutorData.feedbackRecord.push(this.totalData['classroomTutors'][0].classroomFeedbackList[i])
    }
    me.tutorData = tutorData;
  };

  /**
   * 返回上一步
   */
  goBack() {
    this.location.back();
  };

}
