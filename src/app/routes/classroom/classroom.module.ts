import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassroomComponent } from './classroom/classroom.component';
import {ClassroomService} from './classroom.service';
import {AssistantService} from '../assistant/assistant.service';
import {RouterModule, Routes} from '@angular/router';
import {CourseService} from '../course/course.service';
import {SharedModule} from '../../shared/shared.module';
import { ClassroomDetailComponent } from './classroom-detail/classroom-detail.component';

// 路由信息
const routes: Routes = [
  {path: '', component: ClassroomComponent},
  {path: 'detail/:classroomCode/:tutorCode/:type', component: ClassroomDetailComponent}
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,   // 加载依赖模块
    RouterModule.forChild(routes) // 路由
  ],
  providers: [ClassroomService, AssistantService, CourseService],
  declarations: [ClassroomComponent, ClassroomDetailComponent]
})
export class ClassroomModule {}
