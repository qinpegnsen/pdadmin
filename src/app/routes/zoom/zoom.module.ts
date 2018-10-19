import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ZoomComponent} from "./zoom/zoom.component";
import {Routes, RouterModule} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import {ZoomService} from "./zoom.service";

// 路由信息
const routes: Routes = [
  {path: '', component: ZoomComponent}
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule, // 加载依赖模块
    RouterModule.forChild(routes) //路由
  ],
  providers: [ZoomService],
  declarations: [ZoomComponent],
  exports: [
    RouterModule
  ]
})
export class ZoomModule { }
