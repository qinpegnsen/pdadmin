import {LayoutComponent} from '../layout/layout.component';
import {PagesComponent} from "./pages/pages/pages.component";
import {LoginComponent} from "./pages/login/login.component";
import {CanProvide} from "../core/provide/can-provide";

export const routes = [

  {
    path: 'main',
    component: LayoutComponent,
    canActivate: [CanProvide], //路由守卫
    children: [
      {path: '', redirectTo: '/main/home', pathMatch: 'full'},
      {path: 'home', loadChildren: './home/home.module#HomeModule'},
      {path: 'cour', loadChildren: './course/course.module#CourseModule'},                         // 课程体系
      {path: 'tTableAdd', loadChildren: './timetableAdd/timetableAdd.module#TimetableModuleAdd'},  // 制定课表
      {path: 'classGoods', loadChildren: './goods/goods.module#GoodsModule'},                      // 课时商品
      {path: 'msgorder', loadChildren: './msgorder/msgorder.module#MsgorderModule'},                      // 订单信息
      {path: 'assis', loadChildren: './assistant/assistant.module#AssistantModule'},               // 助教管理
      {path: 'user', loadChildren: './student/student.module#StudentModule'},               // 助教管理
      {path: 'system', loadChildren: './system/system.module#SystemModule'},                        // 系统设置
      {path: 'room', loadChildren: './classroom/classroom.module#ClassroomModule'},                   //课堂信息
      {path: 'enterprise', loadChildren: './enterprise/enterprise.module#EnterpriseModule'},           //企业课程
      {path: 'msgTemplate', loadChildren: './msg-template/msg-template.module#MsgTemplateModule'},           //消息模板
      {path: 'zoom', loadChildren: './zoom/zoom.module#ZoomModule'},           //zoom资源管理
      {path: 'export', loadChildren: './export-info/export-info.module#ExportInfoModule'},           //zoom资源管理
      {path: 'questionnaire', loadChildren: './questionnaire/questionnaire.module#QuestionnaireModule'}           //问卷调查
    ]
  },
  {
    path: 'pages',
    component: PagesComponent,    //app.component.ts 对跳转设置了新的引导
    children: [
      {path: '', redirectTo: '/main/home', pathMatch: 'full'},
      {path: 'login', component: LoginComponent}
    ]
  },
  // Not found
  {path: '**', redirectTo: 'main/home'}
];
