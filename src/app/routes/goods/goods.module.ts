import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {GoodscatComponent} from "./goodscat/goodscat.component";
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import {TreeModule} from "angular-tree-component";
import {FormsModule} from "@angular/forms";
import {GoodsComponent} from "./goods/goods.component";
import {GoodsService} from "./goods.service";
import {GoodsaddComponent} from './goodsadd/goodsadd.component';
import { GoodsuploadComponent } from './goodsupload/goodsupload.component';
import {FileUploadModule} from "ng2-file-upload";

// 路由信息
const routes: Routes = [
  {
    path: '', component: GoodsComponent, children: [
    {path: ""},
    {path: 'addOrUpdate', component: GoodsaddComponent}, // 添加课时商品
    {path: 'upload', component: GoodsuploadComponent} // 上传课时商品图片
  ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule, // 加载依赖模块
    RouterModule.forChild(routes), //路由
    TreeModule,
    FormsModule,
    FileUploadModule
  ],
  providers: [GoodsService],
  declarations: [GoodscatComponent, GoodsComponent, GoodsaddComponent, GoodsuploadComponent],
  exports: [
    RouterModule
  ]
})
export class GoodsModule {
}
