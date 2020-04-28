import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { MainComponent, FormClientComponent, SideNavComponent, TabsComponent, HistoryComponent, RegistrationComponent } from "./components";
import { RoutingModule, ClarityDesignModule, FormModule } from "./modules";
import { StorageService, HttpService, HistoryService, TabsHistoryService } from "./services";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    FormClientComponent,
    SideNavComponent,
    TabsComponent,
    HistoryComponent,
    RegistrationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register("ngsw-worker.js", { enabled: environment.production }),
    RoutingModule,
    ClarityDesignModule,
    FormModule
  ],
  providers: [
    StorageService,
    HttpService,
    HistoryService,
    TabsHistoryService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
