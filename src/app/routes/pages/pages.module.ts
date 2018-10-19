import {NgModule} from "@angular/core";
import {LoginComponent} from "./login/login.component";
import {PagesComponent} from "./pages/pages.component";
import {SharedModule} from "../../shared/shared.module";
import {SettingsService} from "../../core/settings/settings.service";
import {PatternService} from "../../core/forms/pattern.service";
import {AjaxService} from "../../core/services/ajax.service";
import {CookieService} from "angular2-cookie/core";

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    PagesComponent,
    LoginComponent

  ],
  providers: [SettingsService, PatternService, AjaxService, CookieService],
  exports: [
    PagesComponent,
    LoginComponent
  ]
})
export class PagesModule {
}
