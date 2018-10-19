import {NgModule} from '@angular/core';
import {HomeComponent} from './home/home.component';
import {Routes, RouterModule} from '@angular/router';
import {FormsModule} from "@angular/forms";
import {CommonModule} from '@angular/common';
import {SharedModule} from "../../shared/shared.module";
import {HomeService} from "./home.service";
import {AngularEchartsModule} from "ngx-echarts";
import {TimetableServiceAdd} from "../timetableAdd/timetableAdd.service";

const routes: Routes = [
  {path: '', component: HomeComponent},
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule, // 加载依赖模块
    RouterModule.forChild(routes), //路由
    FormsModule,
    AngularEchartsModule
  ],
  providers: [HomeService,TimetableServiceAdd],
  declarations: [HomeComponent],
  exports: [
    RouterModule
  ]
})
export class HomeModule {
}
