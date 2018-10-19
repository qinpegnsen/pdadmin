import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {SharedModule} from "../../shared/shared.module";
import {EnterpriseComponent} from './enterprise/enterprise.component';
import {EnterpriseService} from "./enterprise.service";
import {EditEnterpriseComponent} from "./edit-enterprise/edit-enterprise.component";
import {EditMemberComponent} from "./edit-member/edit-member.component";

// 路由信息
const routes: Routes = [
  {
    path: '', component: EnterpriseComponent}
];

@NgModule({
  imports: [
    CommonModule,        // 主要模块
    SharedModule,        // 加载依赖么快
    RouterModule.forChild(routes) // 路由
  ],
  providers:[EnterpriseService],
  declarations: [EnterpriseComponent, EditEnterpriseComponent, EditMemberComponent]
})
export class EnterpriseModule {
}
