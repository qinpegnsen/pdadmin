import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentComponent } from './student/student.component';
import {SharedModule} from "../../shared/shared.module";
import {Routes, RouterModule} from "@angular/router";
import {StudentService} from "./student.service";
import {StudentDetailComponent} from "./student-detail/student-detail.component";

// 路由信息
const routes: Routes = [
  {path: '', component: StudentComponent},
  {path: 'detail', component: StudentDetailComponent}
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes) // 路由
  ],
  providers: [StudentService],
  declarations: [StudentComponent, StudentDetailComponent]
})
export class StudentModule {}
