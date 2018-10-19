import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import {FormsModule} from "@angular/forms";
import {FileUploadModule} from "ng2-file-upload";
import {CourseComponent} from "./course/course.component";
import {CourseService} from "./course.service";
import {CoursecatComponent} from "./coursecat/coursecat.component";
import {EditCourseComponent} from "./edit-course/edit-course.component";
import {CourseWareComponent} from "./course-ware/course-ware.component";
import {UploadCourseWareComponent} from "./upload-course-ware/upload-course-ware.component";
import {BandCourseWareComponent} from "./band-course-ware/band-course-ware.component";

// 路由信息
const routes: Routes = [
  {path: 'course', children:[
    {path: '', component: CourseComponent},
    {path: 'detail', component: BandCourseWareComponent}
  ]},
  {path: 'ware', component: CourseWareComponent}
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule, // 加载依赖模块
    RouterModule.forChild(routes), // 路由
    FormsModule,
    FileUploadModule
  ],
  providers: [CourseService],
  declarations: [ CourseComponent, CoursecatComponent, EditCourseComponent, CourseWareComponent, UploadCourseWareComponent, BandCourseWareComponent],
  exports: [
    RouterModule
  ]
})
export class CourseModule {
}
