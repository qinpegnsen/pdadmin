import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {QuestionnaireComponent} from "./questionnaire/questionnaire.component";
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import {QuestionnaireDetailComponent} from "./questionnaire-detail/questionnaire-detail.component";
import {AssistantService} from "../assistant/assistant.service";
import {CourseService} from "../course/course.service";
import {ClassroomService} from "../classroom/classroom.service";
import {QuestionnaireService} from "./questionnaire.service";

// 路由信息
const routes: Routes = [
  {path: '', component: QuestionnaireComponent},
  {path: 'detail/:classroomCode/:tutorCode', component: QuestionnaireDetailComponent}
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,   // 加载依赖模块
    RouterModule.forChild(routes) // 路由
  ],
  declarations: [QuestionnaireComponent, QuestionnaireDetailComponent],
  providers:[AssistantService,CourseService,ClassroomService,QuestionnaireService]
})
export class QuestionnaireModule { }
