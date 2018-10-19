import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemComponent } from './system/system.component';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule, Routes} from '@angular/router';
import {SystemService} from './system.service';

const routes: Routes = [
  {path: '', component: SystemComponent},
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),          // 路由
    SharedModule                            // 加载依赖模块
  ],
  providers: [SystemService],
  declarations: [SystemComponent]
})
export class SystemModule { }
