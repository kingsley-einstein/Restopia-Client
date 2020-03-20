import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { MainComponent, FormClientComponent } from "./components";
import { RoutingModule, ClarityDesignModule } from "./modules";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    FormClientComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register("ngsw-worker.js", { enabled: environment.production }),
    RoutingModule,
    ClarityDesignModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
