import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AssistantComponent} from './assistant/assistant.component';
import {AddAssistantComponent} from './add-assistant/add-assistant.component';
import {SharedModule} from '../../shared/shared.module';
import {AssistantService} from './assistant.service';
import {AssistantDetailComponent} from './assistant-detail/assistant-detail.component';
import {TeacherComponent} from './teacher/teacher.component';
import {TeacherDetailComponent} from './teacher-detail/teacher-detail.component';
import {AddTeacherComponent} from './add-teacher/add-teacher.component';
import {CourseService} from "../course/course.service";
import { BandCourseComponent } from './band-course/band-course.component';
import { BandTeacherComponent } from './band-teacher/band-teacher.component';
// 助教路由
const assisRoutes: Routes = [
  {path: 'list', component: AssistantComponent},
  {path: 'detail/:assistantCode', component: AssistantDetailComponent},
  {path: 'bandTeacher/:assistantCode', component: BandTeacherComponent},
  {path: '', redirectTo: '/main/assis/assis/list'}
];
// 老师路由
const teachRoutes: Routes = [
  {path: 'list', component: TeacherComponent},
  {path: 'detail/:teacherCode', component: TeacherDetailComponent},
  {path: 'addCourse/:teacherCode', component: BandCourseComponent},
  {path: '', redirectTo: '/main/assis/teach/list'}
];

const routes: Routes = [
  {path: 'assis', children: assisRoutes},
  {path: 'teach', children: teachRoutes}
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,                    // 加载依赖模块
    RouterModule.forChild(routes)    // 路由
  ],
  providers: [AssistantService, CourseService],
  declarations: [
    AssistantComponent,
    AddAssistantComponent,
    AssistantDetailComponent,
    TeacherComponent,
    TeacherDetailComponent,
    AddTeacherComponent,
    BandCourseComponent,
    BandTeacherComponent
  ]
})
export class AssistantModule {
}
