import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainComponent, FormClientComponent } from "../components";

const routes: Routes = [
  { path: "main", component: MainComponent, children: [
    { path: "client", component: FormClientComponent },
    { path: "", redirectTo: "client", pathMatch: "full" }
  ] },
  { path: "", redirectTo: "main", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule {}
