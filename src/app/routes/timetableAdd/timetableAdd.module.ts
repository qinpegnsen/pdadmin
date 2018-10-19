import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TimetableComponentAdd} from "./timetableAdd/timetableAdd.component";
import {TimetableServiceAdd} from "./timetableAdd.service";
import {CourseService} from "../course/course.service";

// 路由信息
const routes: Routes = [
  {path: '', component: TimetableComponentAdd}
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule, // 加载依赖模块
    RouterModule.forChild(routes), //路由
    FormsModule
  ],
  declarations: [TimetableComponentAdd],
  providers: [TimetableServiceAdd,CourseService],
  exports: [
    RouterModule
  ]
})

export class TimetableModuleAdd {
}
