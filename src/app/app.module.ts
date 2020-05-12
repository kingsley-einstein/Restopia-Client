import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppComponent } from "./app.component";
import {
  MainComponent,
  FormClientComponent,
  SideNavComponent,
  TabsComponent,
  HistoryComponent,
  RegistrationComponent,
  LoginComponent
} from "./components";
import { RoutingModule, ClarityDesignModule, FormModule } from "./modules";
import { StorageService, HttpService, HistoryService, TabsHistoryService, AuthService } from "./services";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";

import { CustomHttpInterceptor } from "./config/httpinterceptor";

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    FormClientComponent,
    SideNavComponent,
    TabsComponent,
    HistoryComponent,
    RegistrationComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register("ngsw-worker.js", { enabled: environment.production }),
    RoutingModule,
    ClarityDesignModule,
    FormModule,
    HttpClientModule
  ],
  providers: [
    StorageService,
    HttpService,
    HistoryService,
    TabsHistoryService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomHttpInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
