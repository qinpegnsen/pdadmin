import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MsgorderComponent} from './msgorder/msgorder.component';
import {SharedModule} from "../../shared/shared.module";
import {RouterModule, Routes} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {MsgorderService} from "./msgorder.service";
import {MsgorderDetailsComponent} from './msgorder-details/msgorder-details.component';

// 路由信息
const routes: Routes = [
  {path: '', component: MsgorderComponent},
  {path: 'details', component: MsgorderDetailsComponent}
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule, // 加载依赖模块
    RouterModule.forChild(routes), //路由
    FormsModule
  ],
  providers: [MsgorderService],
  declarations: [MsgorderComponent, MsgorderDetailsComponent],
  exports: [
    RouterModule
  ]
})
export class MsgorderModule {
}
