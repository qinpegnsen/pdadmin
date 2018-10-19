import {Component, OnInit} from "@angular/core";
import {Page} from "../../../core/page/page";
import {RzhtoolsService} from "../../../core/services/rzhtools.service";
import {EnterpriseService} from "../enterprise.service";
import {SettingsService} from "../../../core/settings/settings.service";
import {PatternService} from "../../../core/forms/pattern.service";

declare var $: any;

declare var swal;

@Component({
  selector: 'app-enterprise',
  templateUrl: './enterprise.component.html',
  styleUrls: ['./enterprise.component.scss']
})
export class EnterpriseComponent implements OnInit {
  private enterprises: Page = new Page();            // 企业Page对象
  private members: Array<any> = new Array();        // 成员列表
  private enterpriseOpen: boolean = false;         // 添加企业开关
  private memberOpen: boolean = false;            // 添加成员开关
  private selectEnterprise;                       // 选中企业
  private recharge: boolean = false;             // 充值窗口开关
  private enterpriseInitData = {                 // 企业初始数据
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    age: '',
    sex: '',
    countryCode: '',
    timeZone: '',
    introduction: ''
  }
  private MerberInitData = {                  // 成员初始数据
    studentCode: '',
    firstName: '',
    lastName: '',
    age: '',
    sex: '',
    timeZone: '',
    countryCode: '',
    upperLimit: ''
  }
  private enterpriseIsAdd = {bl: true, data: this.enterpriseInitData};         // 企业添加/修改数据  true 为添加，false为修改详情
  private MemberIsAdd = {bl: true, data: this.MerberInitData};          // 成员添加/修改数据

  constructor(private enterprise: EnterpriseService, private tools: RzhtoolsService, public patterns: PatternService) {}

  ngOnInit() {
    this.getEnterprises();                // 初始化企业和成员数据
  };

  /**
   * 获取企业和成员数据
   */
  getEnterprises() {
    let enterpriseData = this.enterprise.getEnterprises(this.enterprises.curPage || 1, this.enterprises.pageSize || 25);
    this.enterprises = new Page(enterpriseData);
    if(this.selectEnterprise) {
      this.members = this.enterprise.getMember(this.selectEnterprise.studentCode);
    }
  }

  /**
   * 添加企业
   */
  addEnterprise() {
    this.enterpriseOpen = true;
    this.enterpriseIsAdd = {bl: true, data: this.enterpriseInitData};
  }

  /**
   * 取消添加企业
   */
  enterpriseClose() {
    this.enterpriseOpen = false;
  }

  /**
   * 添加成员
   */
  addMember() {
    if(this.selectEnterprise) {
      this.memberOpen = true;
      this.MemberIsAdd = {bl: true, data: this.MerberInitData};
    }else {
      this.tools.rzhAlt('error', SettingsService.I18NINFO.enterprise.sel);
    };
  }

  /**
   * 取消添加成员
   */
  memberClose() {
    this.memberOpen = false;
  }

  /**
   * 查看企业详情
   * @param event          时间对象（阻止时间冒泡用）
   * @param enterpriseObj    被查看企业对象
   */
  enterpriseDetail(event,enterpriseObj) {
    event.cancelBubble = true;
    let enterpriseData = this.enterprise.FormatEnterprise(enterpriseObj);
    this.enterpriseOpen = true;
    this.enterpriseIsAdd = {bl: false, data: enterpriseData};
  }

  /**
   * 修改成员
   * @param memberObj        被修改成员对象
   */
  modifyMember(memberObj) {
    let memberData = this.enterprise.FormatMember(memberObj);
    this.memberOpen = true;
    this.MemberIsAdd = {bl: false, data: memberData};
  }

  /**
   * 删除企业绑定成员
   * @param studentCode              成员编码
   */
  deleteShare(studentCode) {
    this.enterprise.deleteShare(this.selectEnterprise.studentCode, studentCode, (res) => {
      this.tools.rzhAlt('success', SettingsService.I18NINFO.enterprise.delSuccess);
      this.getEnterprises();
    })
  }

  /**
   * 选中企业
   * @param enterprise              被选择企业信息
   */
  select(enterprise) {
    this.selectEnterprise = enterprise;
    this.members = this.enterprise.getMember(this.selectEnterprise.studentCode);
  }

  /**
   * 打开/关闭充值窗口
   */
  rechargeOnOff() {
    this.recharge = !this.recharge;
  }

  /**
   * 为企业充值
   * @param data
   */
  onrecharge(data) {
    let me = this;
    if(data.valid) {
      let startTimeUTC = me.tools.dateToUTC();
      let endTime = me.tools.dataFormat(me.tools.getAroundDateByDate(new Date(), data.value.endTime), 'yyyy-MM-dd HH:mm:ss');
      let endTimeUTC = me.tools.dateToUTC(endTime);
      let rechargeData = {
        courseHour: data.value.courseHour,
        upperLimit: data.value.upperLimit,
        startTime: startTimeUTC,
        endTime: endTimeUTC,
      };
      me.enterprise.recharge(me.selectEnterprise.studentCode, rechargeData, res => {
        me.tools.rzhAlt('success', SettingsService.I18NINFO.enterprise.rechargeSuccess);
        me.getEnterprises();
        me.recharge = !me.recharge;

      })
    }
  }

}
