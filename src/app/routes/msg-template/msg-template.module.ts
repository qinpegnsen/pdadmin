import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MsgTemplateComponent} from './msg-template/msg-template.component';
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import {FormsModule} from "@angular/forms";
import {MsgTemplateService} from "./msg-template.service";
import {MsgAddOrEditComponent} from './msg-add-or-edit/msg-add-or-edit.component';


const routes: Routes = [
  {
    path: '', component: MsgTemplateComponent, children: [
    {path: ""},
    {path: 'addOrEdit', component: MsgAddOrEditComponent}
  ]
  },
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule, // 加载依赖模块
    RouterModule.forChild(routes), //路由
    FormsModule
  ],
  providers: [MsgTemplateService],
  declarations: [MsgTemplateComponent, MsgAddOrEditComponent],
  exports: [
    RouterModule
  ]
})
export class MsgTemplateModule {
}
