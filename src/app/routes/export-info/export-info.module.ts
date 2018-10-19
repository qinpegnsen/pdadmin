import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TutorInfoComponent} from "./tutor-info/tutor-info.component";
import {StuInfoComponent} from "./stu-info/stu-info.component";
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import {AssistantService} from "../assistant/assistant.service";
import {CourseService} from "../course/course.service";
import {ExportInfoService} from "./export-info.service";
import {CalculateComponent} from "./calculate/calculate.component";
// 路由信息
const routes: Routes = [
  {path: 'tutor', component:TutorInfoComponent},
  {path: 'stu', component:StuInfoComponent },
  {path: 'calculate', component:CalculateComponent }
];
@NgModule({
  imports: [
    CommonModule,
    SharedModule, // 加载依赖模块
    RouterModule.forChild(routes), //路由
  ],
  declarations: [TutorInfoComponent, StuInfoComponent, CalculateComponent],
  providers:[AssistantService,ExportInfoService,CourseService]
})

export class ExportInfoModule { }
