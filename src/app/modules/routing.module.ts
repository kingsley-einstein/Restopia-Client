import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainComponent, TabsComponent, RegistrationComponent, LoginComponent, RequestsComponent } from "../components";
import { Activatable } from "../config/canactivate";

const routes: Routes = [
  { path: "main", component: MainComponent, children: [
    { path: "client", component: TabsComponent },
    { path: "registration", component: RegistrationComponent },
    { path: "login", component: LoginComponent },
    { path: "requests", component: RequestsComponent, canActivate: [Activatable] },
    { path: "", redirectTo: "client", pathMatch: "full" }
  ] },
  { path: "", redirectTo: "main", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule {}
