import { Component, OnInit } from '@angular/core';
import {SystemService} from '../system.service';
import {RzhtoolsService} from '../../../core/services/rzhtools.service';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss']
})
export class SystemComponent implements OnInit {

  private sysData;          // 系统设置数据

  constructor(private sys: SystemService, private tools: RzhtoolsService) { }

  ngOnInit() {
    this.sysData = this.sys.getSettings();         // 初始化系统参数
  }

  /**
   * 设置系统参数
   * @param data                      被设置的系统参数数据
   */
  set(data) {
    data.clone = {          // 克隆系统参数防止双向绑定冲突原数据
      v: data.v,
      summary: data.summary
    };
    data.set = true;
  };

  /**
   * 关闭系统参数设置
   * @param data
   */
  noSet(data) {
    data.set = false;
  };

  /**
   * 修改系统参数
   * @param data                //被修改的系统参数数据
   */
  modifySys(data) {
    this.sys.modifySetting(data.k, data.clone.v, data.clone.summary, res => {
        this.sysData = this.sys.getSettings();       // 如果成功，重新初始化数据
    });
  };



}
